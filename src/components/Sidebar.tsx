import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatPhoneNumber } from "@/lib/format";

type Props = {
  chats: string[]; // could be "15865517558 - Al Beahn" or just number
  active: string | null; // raw number
  onSelect: (chat: string) => void;
};

export function Sidebar({ chats, active, onSelect }: Props) {
  // Helper to extract phone number and receiver name
  const extractReceiver = (item: string) => {
    const [phone, name] = item.split(" - ");
    return {
      phone: phone.trim(),
      name: name?.trim() || phone.trim(),
    };
  };

  return (
    <div className="w-80 flex-none border-r h-full overflow-y-auto">
      <h2 className="text-xl font-semibold p-4">Receiver</h2>

      {chats.map((chat) => {
        const { phone, name } = extractReceiver(chat);

        return (
          <div
            key={chat}
            onClick={() => onSelect(phone)} // use raw phone for logic
            className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-100 ${
              active === phone ? "bg-gray-100" : ""
            }`}
          >
            <Avatar className="mr-3">
              <AvatarFallback>{name[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium truncate">{formatPhoneNumber(phone)}</p>
              {/* <p className="text-xs text-gray-500">{phone}</p>{" "} */}
              {/* optional: formatted phone */}
            </div>
          </div>
        );
      })}
    </div>
  );
}
