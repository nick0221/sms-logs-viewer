import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Props = {
  chats: string[];
  active: string | null;
  onSelect: (chat: string) => void;
};

export function Sidebar({ chats, active, onSelect }: Props) {
  return (
    <div className="w-80 flex-none border-r h-full overflow-y-auto">
      <h2 className="text-xl font-semibold p-4">Messages</h2>
      {chats.map((chat) => (
        <div
          key={chat}
          onClick={() => onSelect(chat)}
          className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 ${
            active === chat ? "bg-gray-100" : ""
          }`}
        >
          <Avatar className="mr-3">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium truncate">{chat || "Unknown"}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
