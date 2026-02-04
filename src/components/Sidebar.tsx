import { useState, useMemo } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatPhoneNumber } from "@/lib/format";

type Props = {
  chats: string[]; // could be "15865517558 - Al Beahn" or just number
  active: string | null; // raw number
  onSelect: (chat: string) => void;
  excludeNumber?: string; // optional: number to exclude
};

export function Sidebar({ chats, active, onSelect, excludeNumber }: Props) {
  const [search, setSearch] = useState("");

  // Helper to extract phone number and receiver name
  const extractReceiver = (item: string) => {
    const [phone, name] = item.split(" - ");
    return {
      phone: phone.trim(),
      name: name?.trim() || phone.trim(),
    };
  };

  // Filter chats based on search input and exclusion
  const filteredChats = useMemo(() => {
    return chats
      .filter((chat) => {
        const { phone, name } = extractReceiver(chat);
        if (excludeNumber && phone === excludeNumber) return false; // exclude specific number
        const query = search.toLowerCase();
        return name.toLowerCase().includes(query) || phone.includes(query);
      })
      .sort((a, b) =>
        extractReceiver(a).name.localeCompare(extractReceiver(b).name),
      ); // optional: sort by name
  }, [chats, search, excludeNumber]);

  return (
    <div className="w-80 flex-none border-r h-full overflow-y-auto flex flex-col">
      <h2 className="text-xl font-semibold p-4">SMS Logs Viewer</h2>

      {/* Live search input */}
      <div className="px-4 pb-2">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => {
          const { phone, name } = extractReceiver(chat);

          return (
            <div
              key={chat}
              onClick={() => onSelect(phone)} // raw phone for selection
              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 ${
                active === phone ? "bg-gray-100" : ""
              }`}
            >
              <Avatar className="mr-3">
                <AvatarFallback>{name[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium truncate">
                  {formatPhoneNumber(name)}
                </p>
                {/* Optional: show formatted phone if you want */}
                {/* <p className="text-xs text-gray-500">{formatPhoneNumber(phone)}</p> */}
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
