export function formatPhoneNumber(phone: string | undefined) {
  if (!phone) return "--";

  const digits = phone.replace(/\D/g, ""); // remove everything non-digit

  // If 11 digits and starts with '1', strip leading 1
  const normalized =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  // Only format if 10 digits
  if (normalized.length === 10) {
    const area = normalized.slice(0, 3);
    const prefix = normalized.slice(3, 6);
    const line = normalized.slice(6, 10);
    return `(${area}) ${prefix}-${line}`;
  }

  // Otherwise return raw digits
  return phone;
}
