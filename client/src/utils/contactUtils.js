/**
 * Utility functions for formatting phone numbers and email links
 */

export const DEFAULT_CONTACT = {
  primaryPhone: "99488-32456",
  secondaryPhone: "86886-32456",
  displayPhone: "+91 99488 32456 / 86886 32456",
  email: "sritechsolutions9@gmail.com",
  emails: ["projects@sritechsolution.com", "sritechsolutions9@gmail.com"],
  phones: ["+91 99488 32456", "+91 86886 32456"],
  whatsapp: "+91 99488 32456",
  address: "Sritech Solutions, Ratnaveni Complex, Opp. Budhil Park Hotel, 1st Lane, Dwarakanagar, Visakhapatnam - 530016",
  mapsUrl: "https://maps.google.com/?q=17.7256389,83.3068333",
  mapsEmbedUrl: "https://maps.google.com/maps?q=17.7256389,83.3068333&hl=en&z=16&output=embed",
};

/**
 * Normalizes phone number to international tel link (+91...)
 */
export const formatTelLink = (phone) => {
  if (!phone) return "tel:+919948832456";
  const cleaned = phone.replace(/[^0-9+]/g, "");
  if (cleaned.startsWith("+")) return `tel:${cleaned}`;
  if (cleaned.startsWith("91") && cleaned.length > 10) return `tel:+${cleaned}`;
  // Default to India country code +91
  return `tel:+91${cleaned.slice(-10)}`;
};

/**
 * Normalizes WhatsApp link (https://wa.me/...)
 */
export const formatWhatsAppLink = (phone) => {
  if (!phone) return "https://wa.me/919948832456";
  const digits = phone.replace(/[^0-9]/g, "");
  const full = digits.startsWith("91") ? digits : `91${digits.slice(-10)}`;
  return `https://wa.me/${full}`;
};

/**
 * Normalizes Email link (mailto:...)
 */
export const formatMailtoLink = (email, subject = "Inquiry regarding SriTech Embedded Projects") => {
  const mail = (email || DEFAULT_CONTACT.email).trim();
  const encodedSubject = encodeURIComponent(subject);
  return `mailto:${mail}?subject=${encodedSubject}`;
};

/**
 * Formats a raw phone string into a clean readable display format (+91 99488 32456)
 */
export const formatPhoneDisplay = (phoneStr) => {
  if (!phoneStr) return "";
  const trimmed = phoneStr.trim();
  const digits = trimmed.replace(/[^0-9]/g, "");
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return trimmed;
};

/**
 * Parses multiple phone numbers from an array or delimited string.
 * Handles cases where numbers might be split by /, comma, or accidentally concatenated (+91...+91...).
 */
export const parsePhoneNumbers = (input) => {
  let list = [];

  if (Array.isArray(input)) {
    list = input.map((s) => String(s || "").trim()).filter(Boolean);
  } else if (typeof input === "string" && input.trim()) {
    const raw = input.trim();
    // Split by delimiters (/ , ; |) or detect unseparated '+91' occurrences
    if (raw.includes("/") || raw.includes(",") || raw.includes("|") || raw.includes(";")) {
      list = raw.split(/[/|,;]/).map((p) => p.trim()).filter(Boolean);
    } else if (raw.match(/\+91[^+]+\+91/)) {
      list = raw.split(/(?=\+91)/).map((p) => p.trim()).filter(Boolean);
    } else {
      list = [raw];
    }
  }

  if (list.length === 0) {
    return [
      { raw: "99488-32456", display: "+91 99488 32456", tel: "tel:+919948832456" },
      { raw: "86886-32456", display: "+91 86886 32456", tel: "tel:+918688632456" },
    ];
  }

  return list.map((item) => ({
    raw: item,
    display: formatPhoneDisplay(item),
    tel: formatTelLink(item),
  }));
};

/**
 * Parses multiple email addresses from an array or delimited string.
 */
export const parseEmailAddresses = (input) => {
  let list = [];

  if (Array.isArray(input)) {
    list = input.map((s) => String(s || "").trim()).filter(Boolean);
  } else if (typeof input === "string" && input.trim()) {
    list = input
      .split(/[,/;\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.includes("@"));
  }

  if (list.length === 0) {
    return [DEFAULT_CONTACT.email];
  }

  return list;
};
