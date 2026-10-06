/**
 * Utility functions for formatting phone numbers and email links
 */

export const DEFAULT_CONTACT = {
  primaryPhone: "99488-32456",
  secondaryPhone: "86886-32456",
  displayPhone: "+91 99488 32456 / 86886 32456",
  email: "sritechsolutions9@gmail.com",
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
  const mail = email || DEFAULT_CONTACT.email;
  const encodedSubject = encodeURIComponent(subject);
  return `mailto:${mail}?subject=${encodedSubject}`;
};

/**
 * Parses multiple phone numbers from a phone string like "99488-32456 / 86886-32456"
 */
export const parsePhoneNumbers = (phoneStr) => {
  if (!phoneStr) {
    return [
      { raw: "99488-32456", display: "+91 99488 32456", tel: "tel:+919948832456" },
      { raw: "86886-32456", display: "+91 86886 32456", tel: "tel:+918688632456" },
    ];
  }

  const parts = phoneStr.split(/[/|,]/).map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) {
    return [{ raw: phoneStr, display: phoneStr, tel: formatTelLink(phoneStr) }];
  }

  return parts.map((part) => {
    const digits = part.replace(/[^0-9]/g, "");
    const formatted = digits.length === 10 ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` : part;
    return {
      raw: part,
      display: formatted,
      tel: formatTelLink(part),
    };
  });
};
