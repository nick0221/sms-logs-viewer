import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ChatInput() {
  return (
    <div className="border-t p-4 flex gap-2">
      <Input placeholder="Type a message..." readOnly />
      <Button disabled>Send</Button>
    </div>
  );
}
