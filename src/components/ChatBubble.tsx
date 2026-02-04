import type { SMS } from "@/types/sms";

export function ChatBubble({ sms }: { sms: SMS }) {
  const isOutbound = sms.direction === "outbound"; // Al Beahn sent this

  // Sender and receiver names
  const senderName = isOutbound
    ? "Al Beahn"
    : sms.agentFirstName
      ? `${sms.agentFirstName} ${sms.agentLastName || ""}`
      : sms.from;
  const receiverName = isOutbound ? sms.to : "Al Beahn";

  return (
    <div
      className={`flex mb-3 ${isOutbound ? "justify-end" : "justify-start"}`}
    >
      {/* Avatar for inbound */}
      {!isOutbound && (
        <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 flex items-center justify-center">
          S
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[65%] p-3 text-left text-sm rounded-xl ${
          isOutbound
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-900 rounded-bl-none"
        }`}
      >
        {/* Header showing sender → receiver */}
        <div className="text-xs font-semibold mb-1">
          {isOutbound ? `To: ${receiverName}` : `From: ${senderName}`}
        </div>

        {/* Message Body */}
        <div>{sms.body}</div>

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
          {sms.to?.slice(-2) || "--"}
        </div>
      )}
    </div>
  );
}
