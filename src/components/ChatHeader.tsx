import type { SMS } from "@/types/sms";

export function ChatHeader({
  phone,
  agent,
}: {
  phone: string | null;
  agent?: SMS;
}) {
  if (!phone) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          {phone?.slice(-2) || "--"}
        </div>
        <div>
          <p className="font-semibold">{phone}</p>
          {agent && (
            <p className="text-sm text-gray-500">
              {agent.agentFirstName} {agent.agentLastName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
