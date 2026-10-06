import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Automatically scrolls the browser window to top (0, 0) whenever the route pathname changes.
 * Resolves the issue where navigating to another page starts at the previous page's scroll position.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
