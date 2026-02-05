import { formatPhoneNumber } from "@/lib/format";
import type { SMS } from "@/types/sms";

export function ChatHeader({ sms }: { sms: SMS }) {
  if (!sms) return null;

  const receiverName =
    sms.receiverFname && sms.receiverLname
      ? `${sms.receiverFname} ${sms.receiverLname}`
      : null;

  const displayName = receiverName || formatPhoneNumber(sms.to);

  return (
    <div className="flex w-screen px-5 items-center justify-between  py-3 border-b bg-gray-50 sticky top-0 z-10">
      {/* Avatar */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold">
          {receiverName ? receiverName[0] : sms.to.slice(-2)}
        </div>

        <div className="min-w-0">
          <p className="font-semibold truncate">{displayName}</p>
          {receiverName && (
            <p className="text-sm text-gray-500 truncate">
              {formatPhoneNumber(sms.to)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
