import { useEffect, useState } from "react";

// Animates from 0 up to `value`. If `formatter` is passed, the animated
// number is formatted at every frame (e.g. into "1.2K") instead of showing
// the raw integer with a plain suffix.
const CountUp = ({ value, suffix = "", duration = 1500, formatter }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value == null) return;

    const start = performance.now();
    let frameId;

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(eased * value));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  if (formatter) return <span>{formatter(display)}</span>;

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
};

export default CountUp;
