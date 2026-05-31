import React from "react";
import { MessageCircle, Instagram, Globe, LucideProps } from "lucide-react";
import { Channel } from "@/lib/types";

interface ChannelIconProps {
  channel: Channel;
  size?: number;
  className?: string;
}

export function ChannelIcon({ channel, size = 16, className = "" }: ChannelIconProps) {
  switch (channel) {
    case "whatsapp":
      return (
        <span className={`inline-flex items-center justify-center p-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 ${className}`}>
          <MessageCircle size={size} />
        </span>
      );
    case "instagram":
      return (
        <span className={`inline-flex items-center justify-center p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 ${className}`}>
          <Instagram size={size} />
        </span>
      );
    case "web":
      return (
        <span className={`inline-flex items-center justify-center p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${className}`}>
          <Globe size={size} />
        </span>
      );
    default:
      return null;
  }
}
