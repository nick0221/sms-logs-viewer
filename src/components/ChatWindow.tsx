import type { SMS } from "@/types/sms";

import { ChatBubble } from "./ChatBubble";

export function ChatWindow({ messages }: { messages: SMS[] }) {
  return (
    <div className="flex-1 overflow-y-auto min-w-0 p-4 space-y-2">
      {messages.map((sms, i) => (
        <ChatBubble key={i} sms={sms} previousSms={messages[i - 1]} />
      ))}
    </div>
  );
}
