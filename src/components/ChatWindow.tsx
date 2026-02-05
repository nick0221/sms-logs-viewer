import { useEffect, useRef } from "react";

import type { SMS } from "@/types/sms";

import { ChatBubble } from "./ChatBubble";

export function ChatWindow({ messages }: { messages: SMS[] }) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 🔥 Scroll to bottom when messages change (new convo or new msg)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2">
      {messages.map((sms) => (
        <ChatBubble key={sms.datetime + sms.body} sms={sms} />
      ))}

      {/* anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
