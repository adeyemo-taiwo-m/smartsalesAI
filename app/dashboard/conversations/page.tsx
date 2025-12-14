"use client";

import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Card } from "@/components/ui/card";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "@/lib/mock-data";
import { useState } from "react";
import { Message } from "@/lib/types";

export default function ConversationsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(
    MOCK_CONVERSATIONS[0]?.id || null
  );
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const activeConversation = MOCK_CONVERSATIONS.find(
    (c) => c.id === selectedId
  );
  const activeMessages = selectedId ? messages[selectedId] || [] : [];

  const handleSendMessage = (content: string) => {
    if (!selectedId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId: selectedId,
      senderId: "user",
      senderType: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] || []), newMessage],
    }));

    // Mock AI reply
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        conversationId: selectedId,
        senderId: "ai",
        senderType: "ai",
        content: "Analyzing intent... (Mock AI Reply)",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => ({
        ...prev,
        [selectedId]: [...(prev[selectedId] || []), aiMessage],
      }));
    }, 1500);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 md:flex-row">
      <Card className="flex w-full md:w-80 flex-col border-r overflow-hidden p-0">
        <div className="p-4 border-b font-semibold">Inbox</div>
        <ChatList
          conversations={MOCK_CONVERSATIONS}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </Card>
      <Card className="flex flex-1 flex-col overflow-hidden p-0">
        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            messages={activeMessages}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </Card>
    </div>
  );
}
