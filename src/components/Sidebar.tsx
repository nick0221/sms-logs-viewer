import { useState, useMemo } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatPhoneNumber } from "@/lib/format";

type ChatItem = {
  phone: string; // 'To Number'
  receiverFname?: string; // First name of receiver
  receiverLname?: string; // Last name of receiver
};

type Props = {
  chats: ChatItem[];
  active: string | null; // phone number
  onSelect: (phone: string) => void;
  excludeNumber?: string; // owner's number
};

export function Sidebar({ chats, active, onSelect, excludeNumber }: Props) {
  const [search, setSearch] = useState("");

  // Compose display name
  const getDisplayName = (chat: ChatItem) => {
    const { receiverFname, receiverLname } = chat;

    const firstNameValid =
      receiverFname && receiverFname.toLowerCase() !== "unknown";
    const lastNameValid =
      receiverLname && receiverLname.toLowerCase() !== "unknown";

    if (firstNameValid && lastNameValid)
      return `${receiverFname} ${receiverLname}`;
    if (firstNameValid) return receiverFname!;
    if (lastNameValid) return receiverLname!;
    return "Unknown";
  };

  const filteredChats = useMemo(() => {
    const query = search.toLowerCase();

    return chats
      .filter((chat) => {
        if (excludeNumber && chat.phone === excludeNumber) return false;
        const name = getDisplayName(chat).toLowerCase();
        const phone = (chat.phone || "").toLowerCase();
        return name.includes(query) || phone.includes(query);
      })
      .sort((a, b) => getDisplayName(a).localeCompare(getDisplayName(b)));
  }, [chats, search, excludeNumber]);

  return (
    <div className="w-80 flex-none border-r h-full flex flex-col">
      <h2 className="text-xl font-semibold p-4">SMS Logs Lookup</h2>

      <div className="px-4 pb-2">
        <input
          type="text"
          placeholder="Search name or number…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => {
          const displayName = getDisplayName(chat);
          const initials = displayName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2);

          return (
            <div
              key={chat.phone}
              onClick={() => onSelect(chat.phone)}
              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                active === chat.phone ? "bg-gray-100" : ""
              }`}
            >
              <Avatar className="mr-3">
                <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="font-medium truncate">{displayName}</p>
                <p className="text-xs text-gray-500">
                  {formatPhoneNumber(chat.phone)}
                </p>
              </div>
            </div>
          );
        })}

        {filteredChats.length === 0 && (
          <p className="text-center text-gray-400 mt-4">No results found</p>
        )}
      </div>
    </div>
  );
}
