import { useEffect, useState, useMemo } from "react";

import { fetchSMS } from "@/lib/sheets";
import { Sidebar } from "@/components/Sidebar";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatWindow } from "@/components/ChatWindow";
import { ChatInput } from "@/components/ChatInput";
import type { SMS } from "@/types/sms";

type ChatItem = {
  phone: string;
  receiverFname?: string;
  receiverLname?: string;
};

export default function ChatPage() {
  const [state, setState] = useState<{
    messages: SMS[];
    activePhone: string | null;
    activeSms: SMS | null;
  }>({
    messages: [],
    activePhone: null, // start with no active conversation
    activeSms: null,
  });

  // Fetch SMS once
  useEffect(() => {
    fetchSMS().then((data) => {
      setState((prev) => ({
        ...prev,
        messages: data,
      }));
    });
  }, []);

  const { messages, activePhone, activeSms } = state;

  // Map messages to unique chats with receiver names
  const chats: ChatItem[] = useMemo(() => {
    const map = new Map<string, ChatItem>();

    messages.forEach((m) => {
      const phone = m.direction === "inbound" ? m.from : m.to;
      if (!phone) return;

      if (!map.has(phone)) {
        map.set(phone, {
          phone,
          receiverFname: m.receiverFname,
          receiverLname: m.receiverLname,
        });
      }
    });

    return Array.from(map.values());
  }, [messages]);

  // Only show messages if a conversation is selected
  const activeMsgs = useMemo(
    () =>
      activePhone
        ? messages.filter((m) => m.from === activePhone || m.to === activePhone)
        : [],
    [messages, activePhone],
  );

  // Handle selecting a conversation
  const handleSelect = (phone: string) => {
    const sms =
      messages.find((m) => m.from === phone || m.to === phone) || null;

    setState((prev) => ({
      ...prev,
      activePhone: phone,
      activeSms: sms,
    }));
  };

  return (
    <main className="flex max-w-screen h-screen overflow-hidden border  ">
      {/* Sidebar */}
      <Sidebar chats={chats} active={activePhone} onSelect={handleSelect} />

      {/* Chat area */}
      <div className="flex w-full flex-col flex-1 min-w-0 h-full">
        {/* Header */}
        {activeSms ? (
          <ChatHeader sms={activeSms} />
        ) : (
          <div className="flex w-full items-center justify-center flex-0 border-b text-gray-400 h-16" />
        )}

        {/* Messages */}
        {activePhone ? (
          <ChatWindow messages={activeMsgs} />
        ) : (
          <div className="flex flex-1 h-screen min-w-0 text-gray-400 font-semibold">
            <div className=" w-screen flex items-center justify-center ">
              Select a conversation
            </div>
          </div>
        )}

        {/* Input */}
        {activePhone && <ChatInput />}
      </div>
    </main>
  );
}
