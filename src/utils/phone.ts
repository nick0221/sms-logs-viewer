// utils/phone.ts
export function normalizeUSPhone(phone: string) {
  let digits = phone.replace(/\D/g, ""); // remove non-digits
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1); // strip leading 1
  return digits;
}
