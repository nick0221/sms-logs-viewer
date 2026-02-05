import { useEffect, useRef } from "react";

import type { SMS } from "@/types/sms";

import { ChatBubble } from "./ChatBubble";

export function ChatWindow({ messages }: { messages: SMS[] }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      {messages.map((sms, index) => {
        const previousSms = index > 0 ? messages[index - 1] : undefined;

        // 🔑 Unique key per message
        const bubbleKey = `${sms.datetime}-${sms.from}-${sms.to}-${index}`;

        return (
          <ChatBubble key={bubbleKey} sms={sms} previousSms={previousSms} />
        );
      })}

      {/* Anchor for auto-scroll */}
      <div ref={bottomRef} />
    </div>
  );
}
