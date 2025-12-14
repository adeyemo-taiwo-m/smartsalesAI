"use client";

import { Conversation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface ChatListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ChatList({
  conversations,
  selectedId,
  onSelect,
}: ChatListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={cn(
            "flex cursor-pointer flex-col gap-2 p-4 transition-all hover:bg-muted/50 border-b",
            selectedId === conversation.id && "bg-muted"
          )}
          onClick={() => onSelect(conversation.id)}
        >
          <div className="flex items-center gap-4">
            <Avatar
              className="h-10 w-10"
              fallback={conversation.leadName.charAt(0)}
            />
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">
                  {conversation.leadName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(conversation.timestamp), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                  {conversation.lastMessage}
                </span>
                {conversation.unreadCount > 0 && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">
              {conversation.platform}
            </Badge>
            <Badge
              variant={
                conversation.intent === "Buying" ? "success" : "secondary"
              }
              className="text-[10px] px-1 py-0 h-5"
            >
              {conversation.intent}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
