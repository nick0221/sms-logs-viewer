import { normalizeUSPhone } from "@/utils/phone";
import contacts from "@/data/contacts.json";

type Contact = (typeof contacts)[number]; // infer type from JSON

// Map of normalized phone -> contact
const contactMap = new Map<string, Contact>();
contacts.forEach((c) => {
  contactMap.set(normalizeUSPhone(c.Phone), c);
});
