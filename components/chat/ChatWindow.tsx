"use client";

import { Conversation, Message } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MoreVertical, Phone, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export function ChatWindow({
  conversation,
  messages,
  onSendMessage,
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <Avatar fallback={conversation.leadName.charAt(0)} />
          <div>
            <h3 className="font-semibold">{conversation.leadName}</h3>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20"
        ref={scrollRef}
      >
        {messages.map((message) => {
          const isMe =
            message.senderType === "user" ||
            message.senderType === "system" ||
            message.senderType === "ai"; // In this view, we (business) are right
          // Actually, AI and User are "us", Customer is "them".
          // Let's assume senderType 'customer' is left, others right.
          const isCustomer = message.senderType === "customer";

          return (
            <div
              key={message.id}
              className={cn(
                "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                isCustomer
                  ? "bg-white border text-foreground self-start"
                  : "bg-blue-600 text-white self-end ml-auto"
              )}
            >
              {message.content}
              <span
                className={cn(
                  "text-[10px] opacity-70",
                  !isCustomer && "text-blue-100"
                )}
              >
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {message.senderType === "ai" && " • AI"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="border-t p-4 bg-background">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
