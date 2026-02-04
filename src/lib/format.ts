export function formatPhoneNumber(phone: string | undefined) {
  if (!phone) return "--";

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // Format only if 10 digits
  if (digits.length === 10) {
    const area = digits.slice(0, 3);
    const prefix = digits.slice(3, 6);
    const line = digits.slice(6, 10);
    return `(${area}) ${prefix}-${line}`;
  }

  // Otherwise return as-is
  return phone;
}
