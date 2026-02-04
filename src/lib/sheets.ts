import Papa from "papaparse";

import type { SMS } from "@/types/sms";

export async function fetchSMS(): Promise<SMS[]> {
  const response = await fetch("/sms-data.csv");
  const csvText = await response.text();

  const result = Papa.parse(csvText, { header: true, skipEmptyLines: true });

  return (result.data as any)
    .map((row: any) => {
      if (!row["From Number"] && !row["To Number"]) return null;

      const cleanText = (text?: string) =>
        text ? text.replace(/\\'/g, "'").trim() : "";

      return {
        from: cleanText(row["From Number"]),
        to: cleanText(row["To Number"]),
        body: cleanText(row["Message Body"]),
        datetime: cleanText(row["Date and Time"]),
        direction: row["direction"] === "1" ? "inbound" : "outbound",
        agentFirstName: cleanText(row["Agent's First Name"]),
        agentLastName: cleanText(row["Agents Last Name"]),
        agentEmail: cleanText(row["Agent's Email ID"]),
      } as SMS;
    })
    .filter(Boolean) as SMS[];
}
