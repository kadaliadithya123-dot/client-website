import { useEffect, useState } from "react";
import { HiArrowUp } from "react-icons/hi";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 left-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-navy-900 text-white shadow-lg transition-transform hover:scale-105"
    >
      <HiArrowUp size={20} />
    </button>
  );
};

export default BackToTop;
