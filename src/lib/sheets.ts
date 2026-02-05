import Papa from "papaparse";

import type { SMS } from "@/types/sms";

export async function fetchSMS(): Promise<SMS[]> {
  const response = await fetch("/sms-data.csv");
  const csvText = await response.text();

  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  const cleanText = (text?: string) =>
    text ? text.replace(/\\'/g, "'").trim() : "";

  const normalizeNumber = (num?: string) =>
    num ? num.replace(/\D/g, "").replace(/^1/, "") : "";

  return (result.data as any[])
    .map((row) => {
      if (!row["From Number"] && !row["To Number"]) return null;

      return {
        from: cleanText(row["From Number"]),
        to: cleanText(row["To Number"]),
        fromNormalized: normalizeNumber(row["From Number"]),
        toNormalized: normalizeNumber(row["To Number"]),
        body: cleanText(row["Message Body"]),
        datetime: cleanText(row["Date and Time"]),
        direction: row["direction"] === "1" ? "inbound" : "outbound",
        receiverFname: cleanText(row["toNumberFirstname"]),
        receiverLname: cleanText(row["toNumberLastname"]),
        agentFirstName: cleanText(row["agentFirstName"]),
        agentLastName: cleanText(row["agentLastName"]),
      } as SMS;
    })
    .filter(Boolean) as SMS[];
}
