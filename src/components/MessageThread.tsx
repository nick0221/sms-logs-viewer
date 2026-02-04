import { ScrollArea } from "@/components/ui/scroll-area";
import type { SMS } from "@/types/sms";

import { MessageBubble } from "./MessageBubble";

export function MessageThread({ messages }: { messages: SMS[] }) {
  return (
    <ScrollArea className="h-full p-4">
      {messages.map((sms, i) => (
        <MessageBubble key={i} sms={sms} />
      ))}
    </ScrollArea>
  );
}
