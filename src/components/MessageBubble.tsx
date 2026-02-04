import { cn } from "@/lib/utils";
import type { SMS } from "@/types/sms";

export function MessageBubble({ sms }: { sms: SMS }) {
  const outbound = sms.direction === "outbound";

  return (
    <div
      className={cn("flex mb-2", outbound ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-xl px-4 py-2 text-sm",
          outbound ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        <p>{sms.body}</p>
        <span className="block text-xs opacity-60 mt-1">
          {new Date(sms.datetime).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
