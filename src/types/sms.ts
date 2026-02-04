export type SMS = {
  from: string;
  to: string;
  body: string;
  datetime: string;
  direction: "inbound" | "outbound";
  agentFirstName?: string;
  agentLastName?: string;
  agentEmail?: string;
};
