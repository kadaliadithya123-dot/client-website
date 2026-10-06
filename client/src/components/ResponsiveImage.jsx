import { useState } from "react";

/**
 * Builds responsive srcSet URLs tailored for mobile (480w), tablet (800w), and desktop (1200w) viewports.
 * Compatible with backend image optimizer endpoint, Unsplash, Cloudinary, and standard CDNs.
 */
export const buildResponsiveSrcSet = (src) => {
  if (!src || typeof src !== "string") return "";

  // If it's a data URL or SVG, no srcset needed
  if (src.startsWith("data:") || src.endsWith(".svg")) {
    return "";
  }

  // Unsplash dynamic resizing
  if (src.includes("images.unsplash.com")) {
    const cleanUrl = src.split("?")[0];
    return `${cleanUrl}?auto=format&fit=crop&w=480&q=80 480w, ${cleanUrl}?auto=format&fit=crop&w=800&q=80 800w, ${cleanUrl}?auto=format&fit=crop&w=1200&q=80 1200w`;
  }

  // Cloudinary dynamic resizing
  if (src.includes("res.cloudinary.com") && src.includes("/upload/")) {
    const [base, rest] = src.split("/upload/");
    return `${base}/upload/w_480,c_limit,f_auto,q_auto/${rest} 480w, ${base}/upload/w_800,c_limit,f_auto,q_auto/${rest} 800w, ${base}/upload/w_1200,c_limit,f_auto,q_auto/${rest} 1200w`;
  }

  // Backend / local uploads or API URLs
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}w=480&q=80 480w, ${src}${separator}w=800&q=80 800w, ${src}${separator}w=1200&q=80 1200w`;
};

/**
 * ResponsiveImage:
 * - Serves responsive image srcSet for mobile, tablet, and desktop viewports
 * - Lazy-loads by default with async decoding
 * - Prevents layout shift (CLS) with aspect ratio containers
 * - Graceful fallback on loading error
 */
const ResponsiveImage = ({
  src,
  alt = "",
  className = "",
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  aspectRatio = "",
  objectFit = "cover",
  onClick,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const srcSet = buildResponsiveSrcSet(src);

  if (!src || error) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-slate-400 dark:bg-navy-900/60 dark:text-mist/40 ${aspectRatio} ${className}`}
        role="img"
        aria-label={alt || "Image unavailable"}
      >
        <svg
          className="h-10 w-10 opacity-60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      {/* Skeleton Shimmer while loading */}
      {!loaded && (
        <div className="absolute inset-0 skeleton bg-slate-200 dark:bg-navy-800 animate-pulse" />
      )}

      <img
        src={src}
        srcSet={srcSet || undefined}
        sizes={sizes}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        onClick={onClick}
        className={`h-full w-full object-${objectFit} transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        {...props}
      />
    </div>
  );
};

export default ResponsiveImage;
