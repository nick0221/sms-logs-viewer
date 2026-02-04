import { formatPhoneNumber } from "@/lib/format";
import { decodeUnicode } from "@/lib/utils";
import type { SMS } from "@/types/sms";

export function ChatBubble({ sms }: { sms: SMS }) {
  const isOutbound = sms.direction === "outbound"; // Al Beahn sent this

  return (
    <div
      className={`flex mb-1 min-w-0 p-1  ${isOutbound ? "justify-end" : "justify-start"}`}
    >
      {/* Avatar for inbound */}
      {!isOutbound && (
        <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 flex items-center justify-center">
          R
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[65%] p-3 text-left text-sm rounded-xl ${
          isOutbound
            ? "bg-gray-100 text-gray-900 rounded-br-none"
            : "bg-blue-600 text-white rounded-bl-none"
        }`}
      >
        {/* Header showing sender → receiver */}
        <div
          className={
            `text-xs font-semibold mb-1 ` +
            (isOutbound ? "text-red-500 text-right" : "")
          }
        >
          {!isOutbound
            ? `To: ${formatPhoneNumber(sms.to)}`
            : `From: ${sms.agentFirstName ? `${sms.agentFirstName} ${sms.agentLastName}` : formatPhoneNumber(sms.from)}`}
        </div>

        {/* Message Body */}
        <div>{decodeUnicode(sms.body)}</div>

        {/* Timestamp */}
        <div className="text-xs text-white-500 mt-1 text-right">
          {new Date(sms.datetime).toLocaleTimeString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>

      {/* Avatar for outbound */}
      {isOutbound && (
        <div className="w-8 h-8 bg-blue-200 rounded-full ml-2 flex items-center justify-center">
          S
        </div>
      )}
    </div>
  );
}
