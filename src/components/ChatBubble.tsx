import { decodeUnicode } from "@/lib/utils";
// import { formatPhoneNumber } from "@/lib/format";
import type { SMS } from "@/types/sms";

type ChatBubbleProps = {
  sms: SMS;
  previousSms?: SMS; // optional previous message to compare date
};

export function ChatBubble({ sms, previousSms }: ChatBubbleProps) {
  const isOutbound = sms.direction === "outbound";

  // Format message date (day only)
  const msgDate = new Date(sms.datetime);
  const formattedDate = msgDate.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Previous message date
  const prevDate = previousSms
    ? new Date(previousSms.datetime).toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  // Only show date if it's different from the previous message
  const showDate = formattedDate !== prevDate;

  return (
    <>
      {/* Date separator */}
      {showDate && (
        <div className="flex items-center justify-center w-full py-2 select-none">
          <div className="w-16 border-t border-gray-200 " />
          <span className="mx-3 text-xs text-gray-400">{formattedDate}</span>
          <div className="w-16 border-t border-gray-200" />
        </div>
      )}

      {/* Chat message */}
      <div
        className={`flex mb-1 min-w-0 p-1 ${isOutbound ? "justify-end" : "justify-start"}`}
      >
        {/* Avatar for inbound */}
        {!isOutbound && (
          <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 flex items-center justify-center">
            {sms.receiverFname && sms.receiverLname
              ? `${sms.receiverFname[0]}${sms.receiverLname[0]}`
              : sms.to.slice(-2)}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`max-w-[75%] px-3 text-left text-sm rounded-xl wrap-break-word whitespace-pre-wrap ${
            isOutbound
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gray-100 text-gray-900 rounded-bl-none"
          }`}
        >
          {/* Header showing sender → receiver */}
          <div
            className={`text-xs font-semibold mb-3 ${
              isOutbound ? "text-right" : "text-red-500"
            }`}
          >
            {!isOutbound ? (
              <>
                {/* {sms.receiverFname && sms.receiverLname && (
                  <div>{`${sms.receiverFname} ${sms.receiverLname}`}</div>
                )}
                <div>{formatPhoneNumber(sms.to)}</div> */}
              </>
            ) : (
              <>
                {/* {sms.agentFirstName && sms.agentLastName
                  ? `${sms.agentFirstName} ${sms.agentLastName}`
                  : formatPhoneNumber(sms.from)} */}
              </>
            )}
          </div>

          {/* Message Body */}
          <div>{decodeUnicode(sms.body)}</div>

          {/* Timestamp */}
          <div
            className={`text-xs py-4 ${
              isOutbound
                ? "text-right text-gray-200"
                : "text-left text-gray-500"
            }`}
          >
            {msgDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
          </div>
        </div>

        {/* Avatar for outbound */}
        {isOutbound && (
          <div className="w-8 h-8 bg-blue-200 rounded-full ml-2 flex items-center justify-center">
            {sms.agentFirstName && sms.agentLastName
              ? `${sms.agentFirstName[0]}${sms.agentLastName[0]}`
              : sms.from.slice(-2)}
          </div>
        )}
      </div>
    </>
  );
}
