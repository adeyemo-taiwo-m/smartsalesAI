# SmartSales AI – AI Integration Instruction Guide

> **For the AI/Backend Engineer. Read top to bottom. Build in order.**
> **Stack: Python · FastAPI · Google Gemini · WhatsApp Cloud API · Socket.IO · PostgreSQL**

---

## OVERVIEW

This guide describes how to build the Python backend that powers the AI brain of SmartSales AI. The backend is responsible for:

- Receiving WhatsApp messages via the Meta Cloud API webhook
- Processing messages through Google Gemini to generate intelligent sales responses
- Managing conversation context and lead state in a database
- Pushing real-time events to the Next.js frontend via Socket.IO
- Exposing a REST API the frontend consumes for leads, sales, analytics, and settings

---

## ARCHITECTURE DIAGRAM

```
WhatsApp Cloud API
        │
        ▼ (webhook POST)
┌──────────────────────────────────────────────┐
│              FastAPI Backend                 │
│                                              │
│  ┌────────────┐    ┌─────────────────────┐   │
│  │  Webhook   │───▶│  AI Pipeline        │   │
│  │  Handler   │    │  (Gemini Pro)       │   │
│  └────────────┘    └──────────┬──────────┘   │
│                               │              │
│  ┌────────────┐    ┌──────────▼──────────┐   │
│  │  REST API  │    │  Context Manager    │   │
│  │  Endpoints │    │  (Redis / DB)       │   │
│  └────────────┘    └──────────┬──────────┘   │
│                               │              │
│  ┌────────────────────────────▼──────────┐   │
│  │         PostgreSQL Database           │   │
│  │  leads · messages · sales · settings  │   │
│  └───────────────────────────────────────┘   │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │       Socket.IO Server                 │  │
│  │  (real-time push to Next.js frontend)  │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
        │
        ▼
  Next.js Frontend (existing)
```

---

## PART 1 – PROJECT SETUP

### 1.1 Folder Structure

```
smartsales-backend/
├── app/
│   ├── main.py                  # FastAPI entry point
│   ├── config.py                # Environment config (Pydantic Settings)
│   ├── database.py              # DB connection + session
│   ├── models/
│   │   ├── lead.py
│   │   ├── message.py
│   │   ├── sale.py
│   │   └── settings.py
│   ├── schemas/
│   │   ├── lead.py
│   │   ├── message.py
│   │   ├── sale.py
│   │   └── webhook.py
│   ├── routers/
│   │   ├── webhook.py           # WhatsApp webhook endpoint
│   │   ├── leads.py
│   │   ├── messages.py
│   │   ├── sales.py
│   │   ├── analytics.py
│   │   └── settings.py
│   ├── services/
│   │   ├── ai_service.py        # Gemini integration
│   │   ├── whatsapp_service.py  # Sending messages via Meta API
│   │   ├── lead_service.py      # Lead lifecycle logic
│   │   └── intent_service.py    # Intent detection
│   ├── core/
│   │   ├── socket_manager.py    # Socket.IO server
│   │   └── context_manager.py  # Conversation memory management
│   └── utils/
│       ├── formatters.py
│       └── validators.py
├── alembic/                     # DB migrations
├── tests/
├── .env
├── requirements.txt
└── Dockerfile
```

### 1.2 Install Dependencies

```bash
pip install \
  fastapi==0.111.0 \
  uvicorn[standard]==0.30.0 \
  python-socketio==5.11.2 \
  google-generativeai==0.7.2 \
  httpx==0.27.0 \
  sqlalchemy==2.0.30 \
  alembic==1.13.1 \
  asyncpg==0.29.0 \
  psycopg2-binary==2.9.9 \
  redis==5.0.4 \
  pydantic==2.7.1 \
  pydantic-settings==2.3.0 \
  python-dotenv==1.0.1 \
  python-multipart==0.0.9 \
  tenacity==8.3.0
```

Save to `requirements.txt`.

### 1.3 Environment Variables

Create `.env` at the project root:

```env
# App
APP_ENV=development
SECRET_KEY=your_secret_key_here
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/smartsales

# Redis (for conversation context)
REDIS_URL=redis://localhost:6379

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-pro

# WhatsApp Cloud API (Meta)
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token
WHATSAPP_VERIFY_TOKEN=your_custom_verify_token
WHATSAPP_API_VERSION=v19.0

# Business defaults
DEFAULT_AI_PERSONA_NAME=Aria
DEFAULT_BUSINESS_NAME=Acme Store
```

### 1.4 Config (`app/config.py`)

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_ENV: str = "development"
    SECRET_KEY: str
    FRONTEND_URL: str = "http://localhost:3000"

    DATABASE_URL: str
    REDIS_URL: str

    GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-1.5-pro"

    WHATSAPP_PHONE_NUMBER_ID: str
    WHATSAPP_ACCESS_TOKEN: str
    WHATSAPP_VERIFY_TOKEN: str
    WHATSAPP_API_VERSION: str = "v19.0"

    DEFAULT_AI_PERSONA_NAME: str = "Aria"
    DEFAULT_BUSINESS_NAME: str = "Acme Store"

    class Config:
        env_file = ".env"

settings = Settings()
```

---

## PART 2 – DATABASE MODELS

### 2.1 Lead Model (`app/models/lead.py`)

```python
from sqlalchemy import Column, String, Integer, DateTime, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from app.database import Base
import uuid, datetime

class Lead(Base):
    __tablename__ = "leads"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name          = Column(String, nullable=True)
    phone         = Column(String, unique=True, nullable=False)
    channel       = Column(SAEnum("whatsapp", "instagram", "web", name="channel_enum"), default="whatsapp")
    status        = Column(SAEnum("new", "hot", "warm", "closed", "lost", name="lead_status_enum"), default="new")
    intent_tags   = Column(ARRAY(String), default=[])
    unread_count  = Column(Integer, default=0)
    last_message  = Column(String, nullable=True)
    created_at    = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at    = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
```

### 2.2 Message Model (`app/models/message.py`)

```python
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import uuid, datetime

class Message(Base):
    __tablename__ = "messages"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id     = Column(UUID(as_uuid=True), ForeignKey("leads.id"), nullable=False)
    sender      = Column(SAEnum("customer", "ai", "agent", name="sender_enum"), nullable=False)
    content     = Column(String, nullable=False)
    intent_tag  = Column(String, nullable=True)
    wa_message_id = Column(String, nullable=True)  # WhatsApp message ID for deduplication
    created_at  = Column(DateTime, default=datetime.datetime.utcnow)
```

### 2.3 Business Settings Model (`app/models/settings.py`)

```python
from sqlalchemy import Column, String, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import uuid

class BusinessSettings(Base):
    __tablename__ = "business_settings"

    id                   = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_name        = Column(String, default="Acme Store")
    ai_persona_name      = Column(String, default="Aria")
    ai_tone              = Column(String, default="Friendly")   # Friendly | Professional | Casual
    knowledge_base       = Column(Text, default="")
    auto_followup        = Column(Boolean, default=True)
    human_handoff_trigger = Column(Boolean, default=True)
```

---

## PART 3 – WHATSAPP CLOUD API INTEGRATION

### 3.1 Webhook Verification

Meta requires a GET endpoint to verify your webhook before it starts sending POSTs.

**File:** `app/routers/webhook.py`

```python
from fastapi import APIRouter, Request, Response, HTTPException, Query
from app.config import settings
from app.services.whatsapp_service import WhatsAppService
from app.services.ai_service import AIService
from app.services.lead_service import LeadService
from app.core.socket_manager import socket_manager

router = APIRouter(prefix="/webhook", tags=["Webhook"])
whatsapp = WhatsAppService()
ai_service = AIService()
lead_service = LeadService()


# --- STEP 1: Webhook Verification (GET) ---
@router.get("/whatsapp")
async def verify_webhook(
    hub_mode: str = Query(alias="hub.mode"),
    hub_verify_token: str = Query(alias="hub.verify_token"),
    hub_challenge: str = Query(alias="hub.challenge"),
):
    if hub_mode == "subscribe" and hub_verify_token == settings.WHATSAPP_VERIFY_TOKEN:
        return Response(content=hub_challenge, media_type="text/plain")
    raise HTTPException(status_code=403, detail="Verification failed")


# --- STEP 2: Receive Incoming Messages (POST) ---
@router.post("/whatsapp")
async def receive_message(request: Request):
    body = await request.json()

    try:
        entry = body["entry"][0]
        changes = entry["changes"][0]["value"]

        # Ignore status update events (delivered, read, etc.)
        if "messages" not in changes:
            return {"status": "ok"}

        message_data = changes["messages"][0]
        contact      = changes["contacts"][0]

        wa_message_id = message_data["id"]
        phone         = message_data["from"]          # e.g. "2348012345678"
        message_type  = message_data["type"]          # "text", "image", etc.
        customer_name = contact["profile"]["name"]

        # Only handle text messages for now
        if message_type != "text":
            await whatsapp.send_text(
                phone,
                "Sorry, I can only process text messages at the moment."
            )
            return {"status": "ok"}

        incoming_text = message_data["text"]["body"]

        # Upsert lead in DB
        lead = await lead_service.get_or_create_lead(phone, customer_name, channel="whatsapp")

        # Save customer message to DB
        await lead_service.save_message(
            lead_id=lead.id,
            sender="customer",
            content=incoming_text,
            wa_message_id=wa_message_id,
        )

        # Generate AI reply
        ai_reply, intent_tag = await ai_service.generate_reply(
            lead_id=str(lead.id),
            customer_message=incoming_text,
            customer_name=customer_name,
        )

        # Save AI reply to DB
        await lead_service.save_message(
            lead_id=lead.id,
            sender="ai",
            content=ai_reply,
            intent_tag=intent_tag,
        )

        # Update lead status based on intent
        await lead_service.update_lead_intent(lead.id, intent_tag)

        # Send AI reply back to WhatsApp
        await whatsapp.send_text(phone, ai_reply)

        # Push real-time update to frontend
        await socket_manager.emit_new_message(lead, ai_reply, incoming_text)

    except (KeyError, IndexError):
        # Malformed payload — return 200 to prevent Meta retries
        pass

    return {"status": "ok"}
```

### 3.2 WhatsApp Service (`app/services/whatsapp_service.py`)

```python
import httpx
from app.config import settings


class WhatsAppService:
    BASE_URL = "https://graph.facebook.com/{version}/{phone_id}/messages"

    def __init__(self):
        self.url = self.BASE_URL.format(
            version=settings.WHATSAPP_API_VERSION,
            phone_id=settings.WHATSAPP_PHONE_NUMBER_ID,
        )
        self.headers = {
            "Authorization": f"Bearer {settings.WHATSAPP_ACCESS_TOKEN}",
            "Content-Type": "application/json",
        }

    async def send_text(self, to: str, message: str) -> dict:
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": to,
            "type": "text",
            "text": {"preview_url": False, "body": message},
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(self.url, json=payload, headers=self.headers)
            response.raise_for_status()
            return response.json()

    async def send_interactive_buttons(self, to: str, body: str, buttons: list[str]) -> dict:
        """Send quick-reply buttons (max 3 per WhatsApp spec)."""
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": to,
            "type": "interactive",
            "interactive": {
                "type": "button",
                "body": {"text": body},
                "action": {
                    "buttons": [
                        {"type": "reply", "reply": {"id": f"btn_{i}", "title": btn}}
                        for i, btn in enumerate(buttons[:3])
                    ]
                },
            },
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(self.url, json=payload, headers=self.headers)
            response.raise_for_status()
            return response.json()
```

---

## PART 4 – GOOGLE GEMINI AI SERVICE

This is the core intelligence of SmartSales AI. Every incoming customer message is passed through a structured prompt pipeline before Gemini generates a reply.

### 4.1 AI Service (`app/services/ai_service.py`)

```python
import json
import google.generativeai as genai
from app.config import settings
from app.core.context_manager import ContextManager
from app.services.intent_service import IntentService

genai.configure(api_key=settings.GEMINI_API_KEY)

INTENT_TAGS = ["Buying", "Pricing", "Support", "Inquiry", "Complaint"]

context_manager = ContextManager()
intent_service  = IntentService()


class AIService:

    def __init__(self):
        self.model = genai.GenerativeModel(
            model_name=settings.GEMINI_MODEL,
            generation_config={
                "temperature": 0.7,
                "top_p": 0.9,
                "max_output_tokens": 512,
            },
        )

    async def generate_reply(
        self,
        lead_id: str,
        customer_message: str,
        customer_name: str,
    ) -> tuple[str, str]:
        """
        Returns: (ai_reply_text, intent_tag)
        """

        # 1. Load conversation history for this lead
        history = await context_manager.get_history(lead_id)

        # 2. Load business knowledge base from DB/cache
        kb = await self._get_knowledge_base()

        # 3. Build the system prompt
        system_prompt = self._build_system_prompt(kb, customer_name)

        # 4. Build the full chat history for Gemini
        contents = self._build_contents(history, customer_message)

        # 5. Call Gemini
        response = self.model.generate_content(
            contents=[{"role": "user", "parts": [system_prompt]}, *contents],
        )
        ai_reply = response.text.strip()

        # 6. Detect intent separately
        intent_tag = await intent_service.detect_intent(customer_message)

        # 7. Update conversation history in Redis
        await context_manager.add_turn(lead_id, customer_message, ai_reply)

        return ai_reply, intent_tag

    def _build_system_prompt(self, knowledge_base: str, customer_name: str) -> str:
        persona_name  = settings.DEFAULT_AI_PERSONA_NAME
        business_name = settings.DEFAULT_BUSINESS_NAME

        return f"""
You are {persona_name}, a friendly and professional AI sales assistant for {business_name}.
Your job is to help customers with their inquiries, guide them toward making a purchase,
answer product questions, share pricing, and close sales — all via WhatsApp chat.

CUSTOMER NAME: {customer_name}

BUSINESS KNOWLEDGE BASE:
{knowledge_base if knowledge_base else "No specific product information provided yet. Use general helpful responses."}

RULES:
1. Keep replies SHORT — max 3 sentences or 60 words. WhatsApp users dislike long messages.
2. Always be warm, helpful, and focused on moving the customer toward a purchase.
3. If asked about pricing, give it clearly and add a value statement.
4. If a customer seems frustrated, acknowledge their concern first before problem-solving.
5. Never make up product details not in the knowledge base. Say "Let me check on that for you."
6. End responses with a soft question to keep the conversation going when appropriate.
7. Use Nigerian informal style when the customer writes in pidgin or casual tone.
8. Never break character or mention that you are an AI unless directly asked.
9. If a customer asks to speak with a human, reply: "Sure! I'll connect you with a team member right away. Please hold on a moment. 🙏"
""".strip()

    def _build_contents(self, history: list[dict], current_message: str) -> list[dict]:
        contents = []
        for turn in history[-10:]:   # Keep last 10 turns for context window efficiency
            contents.append({"role": "user",  "parts": [turn["customer"]]})
            contents.append({"role": "model", "parts": [turn["ai"]]})
        contents.append({"role": "user", "parts": [current_message]})
        return contents

    async def _get_knowledge_base(self) -> str:
        # TODO: Replace with DB lookup per business
        # For now return empty string; Settings API will populate this
        return ""
```

### 4.2 Intent Detection Service (`app/services/intent_service.py`)

Intent detection runs as a separate lightweight Gemini call to classify the customer message.

```python
import google.generativeai as genai
from app.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

VALID_INTENTS = ["Buying", "Pricing", "Support", "Inquiry", "Complaint"]

INTENT_PROMPT = """
Classify the customer message below into EXACTLY ONE of these categories:
Buying | Pricing | Support | Inquiry | Complaint

Reply with ONLY the single category word. Nothing else.

Customer message: "{message}"
"""


class IntentService:

    def __init__(self):
        self.model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",   # Use Flash for speed + cost on classification
            generation_config={"temperature": 0.0, "max_output_tokens": 10},
        )

    async def detect_intent(self, message: str) -> str:
        prompt = INTENT_PROMPT.format(message=message)
        try:
            response = self.model.generate_content(prompt)
            intent = response.text.strip()
            return intent if intent in VALID_INTENTS else "Inquiry"
        except Exception:
            return "Inquiry"
```

---

## PART 5 – CONVERSATION CONTEXT MANAGER

Gemini has no memory between API calls. The Context Manager stores conversation turns in Redis so the AI always has the full conversation history when generating a reply.

### 5.1 Context Manager (`app/core/context_manager.py`)

```python
import json
import redis.asyncio as aioredis
from app.config import settings

MAX_HISTORY_TURNS = 20  # Store last 20 turns per conversation


class ContextManager:

    def __init__(self):
        self.redis = aioredis.from_url(settings.REDIS_URL, decode_responses=True)

    def _key(self, lead_id: str) -> str:
        return f"conversation:{lead_id}"

    async def get_history(self, lead_id: str) -> list[dict]:
        """Returns list of {customer: str, ai: str} dicts."""
        raw = await self.redis.get(self._key(lead_id))
        if not raw:
            return []
        return json.loads(raw)

    async def add_turn(self, lead_id: str, customer_message: str, ai_reply: str):
        history = await self.get_history(lead_id)
        history.append({"customer": customer_message, "ai": ai_reply})
        # Keep only last N turns
        history = history[-MAX_HISTORY_TURNS:]
        await self.redis.setex(
            self._key(lead_id),
            86400,   # Expire after 24 hours of inactivity
            json.dumps(history),
        )

    async def clear_history(self, lead_id: str):
        await self.redis.delete(self._key(lead_id))
```

---

## PART 6 – LEAD SERVICE

### 6.1 Lead Service (`app/services/lead_service.py`)

```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.lead import Lead
from app.models.message import Message
from app.database import get_db
import uuid


class LeadService:

    async def get_or_create_lead(
        self,
        phone: str,
        name: str,
        channel: str = "whatsapp",
    ) -> Lead:
        async with get_db() as db:
            result = await db.execute(select(Lead).where(Lead.phone == phone))
            lead = result.scalar_one_or_none()

            if not lead:
                lead = Lead(phone=phone, name=name, channel=channel, status="new")
                db.add(lead)
                await db.commit()
                await db.refresh(lead)
            elif not lead.name and name:
                lead.name = name
                await db.commit()

            return lead

    async def save_message(
        self,
        lead_id: uuid.UUID,
        sender: str,
        content: str,
        intent_tag: str | None = None,
        wa_message_id: str | None = None,
    ) -> Message:
        async with get_db() as db:
            # Deduplicate by WhatsApp message ID
            if wa_message_id:
                existing = await db.execute(
                    select(Message).where(Message.wa_message_id == wa_message_id)
                )
                if existing.scalar_one_or_none():
                    return  # Already processed

            message = Message(
                lead_id=lead_id,
                sender=sender,
                content=content,
                intent_tag=intent_tag,
                wa_message_id=wa_message_id,
            )
            db.add(message)

            # Update lead's last_message and unread_count
            result = await db.execute(select(Lead).where(Lead.id == lead_id))
            lead = result.scalar_one_or_none()
            if lead:
                lead.last_message = content
                if sender == "customer":
                    lead.unread_count = (lead.unread_count or 0) + 1

            await db.commit()
            await db.refresh(message)
            return message

    async def update_lead_intent(self, lead_id: uuid.UUID, intent_tag: str):
        async with get_db() as db:
            result = await db.execute(select(Lead).where(Lead.id == lead_id))
            lead = result.scalar_one_or_none()
            if lead:
                tags = lead.intent_tags or []
                if intent_tag not in tags:
                    tags.append(intent_tag)
                lead.intent_tags = tags
                # Auto-upgrade status based on intent
                if intent_tag == "Buying" and lead.status == "new":
                    lead.status = "hot"
                elif intent_tag == "Pricing" and lead.status == "new":
                    lead.status = "warm"
                await db.commit()
```

---

## PART 7 – REST API ENDPOINTS

### 7.1 Leads Router (`app/routers/leads.py`)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.lead import Lead
from app.database import get_db
from app.schemas.lead import LeadOut, LeadUpdate

router = APIRouter(prefix="/api/leads", tags=["Leads"])


@router.get("/", response_model=list[LeadOut])
async def list_leads(
    channel: str | None = None,
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    query = select(Lead).order_by(desc(Lead.updated_at))
    if channel:
        query = query.where(Lead.channel == channel)
    if status:
        query = query.where(Lead.status == status)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{lead_id}", response_model=LeadOut)
async def get_lead(lead_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lead).where(Lead.id == lead_id))
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.patch("/{lead_id}", response_model=LeadOut)
async def update_lead(lead_id: str, data: LeadUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lead).where(Lead.id == lead_id))
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(lead, field, value)
    await db.commit()
    await db.refresh(lead)
    return lead
```

### 7.2 Messages Router (`app/routers/messages.py`)

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, asc
from app.models.message import Message
from app.database import get_db
from app.schemas.message import MessageOut, AgentMessageIn
from app.services.whatsapp_service import WhatsAppService
from app.services.lead_service import LeadService
from app.models.lead import Lead

router = APIRouter(prefix="/api/messages", tags=["Messages"])
whatsapp = WhatsAppService()
lead_service = LeadService()


@router.get("/{lead_id}", response_model=list[MessageOut])
async def get_messages(lead_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Message).where(Message.lead_id == lead_id).order_by(asc(Message.created_at))
    )
    return result.scalars().all()


@router.post("/{lead_id}/agent-reply")
async def agent_reply(
    lead_id: str,
    body: AgentMessageIn,
    db: AsyncSession = Depends(get_db),
):
    """Human agent sends a message manually from the dashboard."""
    result = await db.execute(select(Lead).where(Lead.id == lead_id))
    lead = result.scalar_one_or_none()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    # Save agent message
    await lead_service.save_message(
        lead_id=lead.id,
        sender="agent",
        content=body.content,
    )

    # Send via WhatsApp
    await whatsapp.send_text(lead.phone, body.content)
    return {"status": "sent"}
```

### 7.3 Analytics Router (`app/routers/analytics.py`)

```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, cast, Date
from app.models.lead import Lead
from app.models.message import Message
from app.models.sale import Sale
from app.database import get_db
import datetime

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/dashboard-stats")
async def dashboard_stats(db: AsyncSession = Depends(get_db)):
    today = datetime.date.today()

    total_chats_today = await db.scalar(
        select(func.count(Message.id)).where(
            cast(Message.created_at, Date) == today
        )
    )
    new_leads = await db.scalar(
        select(func.count(Lead.id)).where(
            cast(Lead.created_at, Date) == today
        )
    )
    sales_closed = await db.scalar(
        select(func.count(Sale.id)).where(
            Sale.status == "completed",
            cast(Sale.date, Date) == today,
        )
    )
    revenue = await db.scalar(
        select(func.sum(Sale.amount)).where(
            Sale.status == "completed",
            cast(Sale.date, Date) == today,
        )
    ) or 0

    return {
        "totalChatsToday": total_chats_today or 0,
        "newLeads": new_leads or 0,
        "salesClosed": sales_closed or 0,
        "revenueGenerated": float(revenue),
    }


@router.get("/funnel")
async def funnel_data(db: AsyncSession = Depends(get_db)):
    stages = {
        "New Leads":    ("new",),
        "Interested":   ("warm",),
        "Negotiating":  ("hot",),
        "Converted":    ("closed",),
    }
    result = []
    colors = {"New Leads": "#2563EB", "Interested": "#7C3AED", "Negotiating": "#F97316", "Converted": "#22C55E"}
    for stage, statuses in stages.items():
        count = await db.scalar(
            select(func.count(Lead.id)).where(Lead.status.in_(statuses))
        )
        result.append({"stage": stage, "count": count or 0, "color": colors[stage]})
    return result
```

### 7.4 Settings Router (`app/routers/settings.py`)

```python
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.settings import BusinessSettings
from app.database import get_db
from app.schemas.settings import SettingsOut, SettingsUpdate
from app.core.context_manager import ContextManager

router = APIRouter(prefix="/api/settings", tags=["Settings"])
context_manager = ContextManager()


@router.get("/", response_model=SettingsOut)
async def get_settings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BusinessSettings).limit(1))
    settings_row = result.scalar_one_or_none()
    if not settings_row:
        settings_row = BusinessSettings()
        db.add(settings_row)
        await db.commit()
        await db.refresh(settings_row)
    return settings_row


@router.put("/", response_model=SettingsOut)
async def update_settings(data: SettingsUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(BusinessSettings).limit(1))
    settings_row = result.scalar_one_or_none()
    if not settings_row:
        settings_row = BusinessSettings()
        db.add(settings_row)

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(settings_row, field, value)

    await db.commit()
    await db.refresh(settings_row)
    return settings_row
```

---

## PART 8 – SOCKET.IO REAL-TIME SERVER

The frontend currently uses a simulated Socket.IO client (`src/lib/socket.ts`). This section replaces that simulation with a real Socket.IO server.

### 8.1 Socket Manager (`app/core/socket_manager.py`)

```python
import socketio
from app.models.lead import Lead

# Create async Socket.IO server
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",   # Restrict to FRONTEND_URL in production
    logger=False,
    engineio_logger=False,
)


@sio.event
async def connect(sid, environ):
    print(f"[Socket.IO] Client connected: {sid}")


@sio.event
async def disconnect(sid):
    print(f"[Socket.IO] Client disconnected: {sid}")


@sio.event
async def join_room(sid, data):
    """Frontend joins a room for a specific lead conversation."""
    room = f"lead_{data['lead_id']}"
    await sio.enter_room(sid, room)


class SocketManager:

    async def emit_new_message(self, lead: Lead, ai_reply: str, customer_message: str):
        """Push new message event to all dashboard clients watching this lead."""
        await sio.emit(
            "new_message",
            {
                "leadId":          str(lead.id),
                "customerMessage": customer_message,
                "aiReply":         ai_reply,
                "leadName":        lead.name,
                "leadPhone":       lead.phone,
            },
        )

    async def emit_lead_update(self, lead: Lead):
        await sio.emit(
            "lead_updated",
            {
                "leadId":  str(lead.id),
                "status":  lead.status,
                "name":    lead.name,
            },
        )

    async def emit_stats_update(self, stats: dict):
        await sio.emit("stats_updated", stats)


socket_manager = SocketManager()
```

### 8.2 Mount Socket.IO in FastAPI (`app/main.py`)

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio

from app.config import settings
from app.core.socket_manager import sio
from app.routers import webhook, leads, messages, analytics, settings as settings_router

app = FastAPI(title="SmartSales AI Backend", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(webhook.router)
app.include_router(leads.router)
app.include_router(messages.router)
app.include_router(analytics.router)
app.include_router(settings_router.router)

# Mount Socket.IO as ASGI sub-app
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)

# Health check
@app.get("/health")
async def health():
    return {"status": "ok", "service": "SmartSales AI Backend"}
```

### 8.3 Run Command

```bash
uvicorn app.main:socket_app --host 0.0.0.0 --port 8000 --reload
```

> **Note:** The entry point must be `socket_app`, not `app`, so that Socket.IO and FastAPI share the same port.

### 8.4 Update Next.js Frontend to Connect to Real Socket.IO

Replace the simulation in `src/lib/socket.ts` with:

```typescript
import { io, Socket } from "socket.io-client";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(BACKEND_URL, { transports: ["websocket"] });
  }
  return socket;
}

export function joinLeadRoom(leadId: string) {
  getSocket().emit("join_room", { lead_id: leadId });
}
```

Add to `.env.local` in your Next.js project:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

---

## PART 9 – DATABASE SETUP

### 9.1 Async Database Session (`app/database.py`)

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config import settings
from contextlib import asynccontextmanager

engine = create_async_engine(settings.DATABASE_URL, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


@asynccontextmanager
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
```

### 9.2 Alembic Migration Setup

```bash
alembic init alembic
```

In `alembic/env.py`, replace the `target_metadata` line:

```python
from app.database import Base
from app.models import lead, message, sale, settings  # import all models
target_metadata = Base.metadata
```

Generate and run the first migration:

```bash
alembic revision --autogenerate -m "initial schema"
alembic upgrade head
```

---

## PART 10 – PYDANTIC SCHEMAS

### `app/schemas/lead.py`

```python
from pydantic import BaseModel
from typing import Optional
import uuid, datetime

class LeadOut(BaseModel):
    id: uuid.UUID
    name: Optional[str]
    phone: str
    channel: str
    status: str
    intent_tags: list[str]
    unread_count: int
    last_message: Optional[str]
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True


class LeadUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[str] = None
    unread_count: Optional[int] = None
```

### `app/schemas/message.py`

```python
from pydantic import BaseModel
from typing import Optional
import uuid, datetime

class MessageOut(BaseModel):
    id: uuid.UUID
    lead_id: uuid.UUID
    sender: str
    content: str
    intent_tag: Optional[str]
    created_at: datetime.datetime

    class Config:
        from_attributes = True


class AgentMessageIn(BaseModel):
    content: str
```

### `app/schemas/settings.py`

```python
from pydantic import BaseModel
from typing import Optional

class SettingsOut(BaseModel):
    business_name: str
    ai_persona_name: str
    ai_tone: str
    knowledge_base: str
    auto_followup: bool
    human_handoff_trigger: bool

    class Config:
        from_attributes = True


class SettingsUpdate(BaseModel):
    business_name: Optional[str] = None
    ai_persona_name: Optional[str] = None
    ai_tone: Optional[str] = None
    knowledge_base: Optional[str] = None
    auto_followup: Optional[bool] = None
    human_handoff_trigger: Optional[bool] = None
```

---

## PART 11 – WHATSAPP CLOUD API SETUP (META)

### 11.1 Meta Developer App Setup

Follow these steps on the Meta Developer Portal before the webhook will receive messages:

1. Go to [developers.facebook.com](https://developers.facebook.com) and create a new App → **Business** type
2. Add **WhatsApp** product to your app
3. Under **WhatsApp > API Setup**, note your:
   - **Phone Number ID** → `WHATSAPP_PHONE_NUMBER_ID`
   - **Temporary Access Token** (generate a permanent token for production)
4. Under **WhatsApp > Configuration**:
   - Set **Webhook URL** to: `https://yourdomain.com/webhook/whatsapp`
   - Set **Verify Token** to the same value as `WHATSAPP_VERIFY_TOKEN` in your `.env`
   - Subscribe to the **messages** webhook field
5. Under **WhatsApp > Phone Numbers**, add and verify a test/production phone number

### 11.2 Local Testing with ngrok

Meta requires a public HTTPS URL to deliver webhooks. Use ngrok during development:

```bash
ngrok http 8000
```

Copy the `https://` forwarding URL and use it as your webhook URL in the Meta Developer Portal. Note: the ngrok URL changes every session unless you have a paid plan.

### 11.3 Permanent Access Token

The temporary token expires in 24 hours. Generate a permanent System User token:

1. In Meta Business Suite → **Settings → System Users**
2. Create a System User and assign WhatsApp permissions
3. Generate a token — this is your permanent `WHATSAPP_ACCESS_TOKEN`

---

## PART 12 – HUMAN HANDOFF FLOW

When the customer says they want to speak with a human (or the frontend agent toggles "Human Takeover"), the AI must stop responding automatically.

### 12.1 Human Takeover Flag in Redis

```python
# In context_manager.py — add these methods:

async def set_human_mode(self, lead_id: str, is_human: bool):
    key = f"human_mode:{lead_id}"
    if is_human:
        await self.redis.set(key, "1", ex=3600)
    else:
        await self.redis.delete(key)

async def is_human_mode(self, lead_id: str) -> bool:
    return await self.redis.exists(f"human_mode:{lead_id}") == 1
```

### 12.2 Modify Webhook to Respect Human Mode

In `app/routers/webhook.py`, add this check before calling the AI:

```python
# Check if human has taken over this conversation
if await context_manager.is_human_mode(str(lead.id)):
    # Don't reply with AI — just save the message and push to frontend
    await socket_manager.emit_new_message(lead, "", incoming_text)
    return {"status": "ok"}
```

### 12.3 Handoff API Endpoint

Add to `app/routers/messages.py`:

```python
@router.post("/{lead_id}/handoff")
async def toggle_handoff(lead_id: str, data: dict):
    """Toggle human takeover mode for a lead."""
    is_human = data.get("isHuman", False)
    await context_manager.set_human_mode(lead_id, is_human)
    return {"status": "ok", "isHuman": is_human}
```

The frontend `ChatWindow.tsx` should call `POST /api/messages/{leadId}/handoff` when the "Human Takeover" toggle is switched.

---

## PART 13 – ENVIRONMENT-SPECIFIC CONFIGURATIONS

### Development

```bash
# Start PostgreSQL and Redis locally
docker compose up -d db redis

# Run backend
uvicorn app.main:socket_app --reload --port 8000

# Run ngrok for WhatsApp webhook
ngrok http 8000
```

### Production

```dockerfile
# Dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:socket_app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

```yaml
# docker-compose.yml
version: "3.9"

services:
  backend:
    build: .
    ports:
      - "8000:8000"
    env_file: .env
    depends_on:
      - db
      - redis

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: smartsales
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: smartsales
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## PART 14 – API ENDPOINT REFERENCE

| Method  | URL                                   | Description                              |
| ------- | ------------------------------------- | ---------------------------------------- |
| `GET`   | `/health`                             | Health check                             |
| `GET`   | `/webhook/whatsapp`                   | Meta webhook verification                |
| `POST`  | `/webhook/whatsapp`                   | Receive incoming WhatsApp messages       |
| `GET`   | `/api/leads/`                         | List all leads (filter: channel, status) |
| `GET`   | `/api/leads/{id}`                     | Get single lead                          |
| `PATCH` | `/api/leads/{id}`                     | Update lead                              |
| `GET`   | `/api/messages/{lead_id}`             | Get all messages for a lead              |
| `POST`  | `/api/messages/{lead_id}/agent-reply` | Human agent sends a manual reply         |
| `POST`  | `/api/messages/{lead_id}/handoff`     | Toggle human takeover on/off             |
| `GET`   | `/api/analytics/dashboard-stats`      | Today's KPI stats                        |
| `GET`   | `/api/analytics/funnel`               | Sales funnel data                        |
| `GET`   | `/api/settings/`                      | Get business settings                    |
| `PUT`   | `/api/settings/`                      | Update business settings                 |

---

## PART 15 – BUILD ORDER CHECKLIST

Follow this exact order:

- [ ] 1. Set up project structure and install dependencies
- [ ] 2. Configure `.env` with all keys
- [ ] 3. Write `config.py`, `database.py`
- [ ] 4. Create all SQLAlchemy models
- [ ] 5. Run Alembic migrations
- [ ] 6. Build `ContextManager` (Redis)
- [ ] 7. Build `IntentService` (Gemini Flash)
- [ ] 8. Build `AIService` (Gemini Pro, full reply generation)
- [ ] 9. Build `WhatsAppService` (send messages)
- [ ] 10. Build `LeadService` (get_or_create, save_message)
- [ ] 11. Build webhook router (verify + receive)
- [ ] 12. Build Socket.IO server + `SocketManager`
- [ ] 13. Mount everything in `main.py`
- [ ] 14. Test end-to-end locally with ngrok
- [ ] 15. Build REST routers (leads, messages, analytics, settings)
- [ ] 16. Write Pydantic schemas for all models
- [ ] 17. Update Next.js frontend socket client to point to real backend
- [ ] 18. Replace frontend mock data calls with real API fetches
- [ ] 19. Implement human handoff flow
- [ ] 20. Write Dockerfile + docker-compose
- [ ] 21. Deploy to production (Railway / Render / DigitalOcean)
- [ ] 22. Set permanent WhatsApp access token + production webhook URL
- [ ] 23. Final end-to-end QA (real WhatsApp message → Gemini reply → dashboard update)

---

## NOTES FOR THE AI ENGINEER

- **Gemini model choice:** Use `gemini-1.5-pro` for reply generation (better quality) and `gemini-1.5-flash` for intent classification (faster, cheaper). This reduces cost per message by ~70%.
- **Context window:** Gemini 1.5 Pro has a 1M token context window but you should still cap history to 10–20 turns in Redis to keep latency low and costs predictable.
- **System prompt per business:** The knowledge base in `BusinessSettings` drives the AI's product knowledge. Advise clients to paste their full price list, FAQs, and product descriptions into the Settings page.
- **Deduplication:** Always check `wa_message_id` before saving a message. Meta sometimes re-delivers webhooks.
- **Rate limits:** Gemini 1.5 Pro allows 360 requests/minute on the free tier. At scale, add a simple in-memory rate limiter using `asyncio.Semaphore`.
- **WhatsApp 24-hour window:** Meta only allows free-form messages within 24 hours of the customer's last message. After that, you must use approved Message Templates. Plan for this in the auto-follow-up feature.
- **No `any` types:** Match Python type hints rigorously with the TypeScript interfaces in `src/types/index.ts` — this prevents bugs at the frontend/backend boundary.
- **Currency:** All monetary values stored as `Numeric(12, 2)` in PostgreSQL and returned as floats. The frontend formats them with the `₦` symbol.

---

_SmartSales AI Backend — Built to Sell While You Sleep. 🚀_
