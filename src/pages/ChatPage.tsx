import { MessagesSquare } from "lucide-react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile toggle
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

  // Build sidebar conversations, exclude owner
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

    // Sort newest first
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

  // Select a conversation
  const handleSelect = (phone: string) => {
    setIsSwitching(true);
    requestAnimationFrame(() => {
      const sms =
        messages.find((m) => m.from === phone || m.to === phone) || null;
      setActivePhone(phone);
      setActiveSms(sms);
      setSidebarOpen(false); // close sidebar on mobile
      setIsSwitching(false);
    });
  };

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 border-r bg-white transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:flex`}
      >
        <Sidebar
          chats={chats}
          active={activePhone}
          onSelect={handleSelect}
          excludeNumber={OWNER_NUMBER}
        />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-white/20 backdrop-blur-lg bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Chat area */}
      <div className="flex  flex-col flex-1 min-w-0 h-full ">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between p-2 border-b md:hidden">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <MessagesSquare />
          </button>
          <span className="font-semibold truncate">
            {activeSms
              ? activeSms.receiverFname
                ? `${activeSms.receiverFname} ${activeSms.receiverLname ?? ""}`
                : activePhone
              : ""}
          </span>
        </div>

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
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <ChatWindow messages={activeMsgs} />
            <ChatInput />
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </main>
  );
}
