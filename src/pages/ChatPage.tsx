import { useEffect, useState, useMemo } from "react";

import { fetchSMS } from "@/lib/sheets";
import { Sidebar } from "@/components/Sidebar";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatWindow } from "@/components/ChatWindow";
import { ChatInput } from "@/components/ChatInput";
import CenteredLoader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import type { SMS } from "@/types/sms";

type ChatItem = {
  phone: string;
  receiverFname?: string;
  receiverLname?: string;
  lastMessageAt: string;
};

const OWNER_NUMBER = "15865517558"; // Exclude this number

export default function ChatPage() {
  const [messages, setMessages] = useState<SMS[]>([]);
  const [activePhone, setActivePhone] = useState<string | null>(null);
  const [activeSms, setActiveSms] = useState<SMS | null>(null);

  const [isFetching, setIsFetching] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);

  // Fetch SMS once
  useEffect(() => {
    const loadMessages = async () => {
      setIsFetching(true);
      const data = await fetchSMS();
      setMessages(data);
      setIsFetching(false);
    };

    loadMessages();
  }, []);

  // Build sidebar conversations, exclude owner, pick latest message per phone
  const chats: ChatItem[] = useMemo(() => {
    const map = new Map<string, ChatItem>();

    messages.forEach((m) => {
      const phone = m.direction === "inbound" ? m.from : m.to;
      if (!phone || phone === OWNER_NUMBER) return;

      const existing = map.get(phone);
      const currentTime = new Date(m.datetime).getTime();

      if (
        !existing ||
        currentTime > new Date(existing.lastMessageAt).getTime()
      ) {
        map.set(phone, {
          phone,
          receiverFname: m.receiverFname,
          receiverLname: m.receiverLname,
          lastMessageAt: m.datetime,
        });
      }
    });

    // Sort descending: newest first
    return Array.from(map.values()).sort(
      (a, b) =>
        new Date(b.lastMessageAt).getTime() -
        new Date(a.lastMessageAt).getTime(),
    );
  }, [messages]);

  // Messages for active conversation
  const activeMsgs = useMemo(() => {
    if (!activePhone) return [];
    return messages.filter(
      (m) => m.from === activePhone || m.to === activePhone,
    );
  }, [messages, activePhone]);

  // Select a conversation with small async tick to avoid synchronous setState
  const handleSelect = (phone: string) => {
    setIsSwitching(true);

    requestAnimationFrame(() => {
      const sms =
        messages.find((m) => m.from === phone || m.to === phone) || null;
      setActivePhone(phone);
      setActiveSms(sms);
      setIsSwitching(false);
    });
  };

  return (
    <main className="flex max-w-screen h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        active={activePhone}
        onSelect={handleSelect}
        excludeNumber={OWNER_NUMBER}
      />

      {/* Chat area */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Header */}
        {activeSms && !isSwitching ? (
          <ChatHeader sms={activeSms} />
        ) : (
          <div className="h-16 border-b" />
        )}

        {/* Content */}
        {isFetching ? (
          <CenteredLoader label="Loading messages…" />
        ) : isSwitching ? (
          <CenteredLoader label="Loading conversation…" />
        ) : activePhone ? (
          <>
            <ChatWindow messages={activeMsgs} />
            <ChatInput />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </main>
  );
}
