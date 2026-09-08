import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import api from "../services/api.js";

const WhatsAppButton = () => {
  const [phone, setPhone] = useState("919000000000");

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => {
        const raw = res.data.data?.whatsapp;
        if (raw) setPhone(raw.replace(/[^0-9]/g, ""));
      })
      .catch(() => {});
  }, []);

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105"
    >
      <FaWhatsapp size={26} />
    </a>
  );
};

export default WhatsAppButton;
