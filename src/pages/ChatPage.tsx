import { useEffect, useState } from "react";

import { fetchSMS } from "@/lib/sheets";
import { Sidebar } from "@/components/Sidebar";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatWindow } from "@/components/ChatWindow";
import { ChatInput } from "@/components/ChatInput";
import type { SMS } from "@/types/sms";

export default function ChatPage() {
  const [messages, setMessages] = useState<SMS[]>([]);
  const [activePhone, setActivePhone] = useState<string | null>(null);

  useEffect(() => {
    fetchSMS().then((data) => {
      setMessages(data);
      setActivePhone(
        data[0]?.direction === "inbound" ? data[0].from : data[0].to,
      );
    });
  }, []);

  const chats = Array.from(
    new Set(
      messages
        .map((m) => (m.direction === "inbound" ? m.from : m.to))
        .filter((v): v is string => Boolean(v && v.trim())),
    ),
  );

  const activeMsgs = messages.filter(
    (m) => m.from === activePhone || m.to === activePhone,
  );

  //   const activeMsg = messages.find(
  //     (m) => m.from === activePhone || m.to === activePhone,
  //   );

  return (
    <>
      <div className="flex h-full w-full ">
        {/* flex row */}
        <Sidebar chats={chats} active={activePhone} onSelect={setActivePhone} />
        <div className="flex flex-col flex-1 min-w-0 h-full">
          {/* chat panel */}
          <ChatHeader phone={activePhone} />
          <ChatWindow messages={activeMsgs} />
          <ChatInput />
        </div>
      </div>
    </>
  );
}
