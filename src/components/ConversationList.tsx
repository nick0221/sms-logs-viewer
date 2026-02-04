import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Props = {
  conversations: string[];
  active: string | null;
  onSelect: (phone: string) => void;
};

export function ConversationList({ conversations, active, onSelect }: Props) {
  return (
    <ScrollArea className="h-full border-r">
      {conversations.map((phone) => (
        <div
          key={phone}
          onClick={() => onSelect(phone)}
          className={cn(
            "cursor-pointer px-4 py-3 hover:bg-muted",
            active === phone && "bg-muted",
          )}
        >
          <p className="font-medium">{phone}</p>
        </div>
      ))}
    </ScrollArea>
  );
}
