import { useEffect, useState } from "react";

import { fetchSMS } from "@/lib/sheets";
import { ConversationList } from "@/components/ConversationList";
import { MessageThread } from "@/components/MessageThread";
import type { SMS } from "@/types/sms";

export default function Inbox() {
  const [messages, setMessages] = useState<SMS[]>([]);
  const [activePhone, setActivePhone] = useState<string | null>(null);

  useEffect(() => {
    fetchSMS().then((data) => {
      setMessages(data);
      setActivePhone(data[0]?.from || null);
    });
  }, []);

  const conversations = Array.from(
    new Set(messages.map((m) => (m.direction === "inbound" ? m.from : m.to))),
  );

  const thread = messages.filter(
    (m) => m.from === activePhone || m.to === activePhone,
  );

  return (
    <div className="flex h-screen">
      <div className="w-72">
        <ConversationList
          conversations={conversations}
          active={activePhone}
          onSelect={setActivePhone}
        />
      </div>
      <div className="flex-1">
        <MessageThread messages={thread} />
      </div>
    </div>
  );
}
