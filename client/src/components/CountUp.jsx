import { useEffect, useState } from "react";

// Animates from 0 up to `value` whenever `value` changes.
const CountUp = ({ value, suffix = "", duration = 1500 }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value == null) return;

    const start = performance.now();
    let frameId;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
};

export default CountUp;
