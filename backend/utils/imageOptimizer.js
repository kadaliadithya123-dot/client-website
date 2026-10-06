const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

/**
 * Ensures cache directory exists
 */
const getCacheDir = (uploadDir) => {
  const cacheDir = path.join(uploadDir, ".cache");
  if (!fs.existsSync(cacheDir)) {
    try {
      fs.mkdirSync(cacheDir, { recursive: true });
    } catch (err) {
      // Ignore directory creation errors
    }
  }
  return cacheDir;
};

/**
 * Express middleware to serve responsive, optimized WebP images
 * Example requests:
 *  /uploads/photo.jpg?w=480&q=80
 *  /uploads/photo.jpg?w=800
 *  /uploads/photo.jpg?w=1200
 */
const serveOptimizedImage = (uploadDir) => {
  return async (req, res, next) => {
    // Only handle GET requests with image extensions
    if (req.method !== "GET") return next();

    const filename = req.path.replace(/^\//, "");
    if (!filename || filename.includes("..")) return next();

    const ext = path.extname(filename).toLowerCase();
    const isImage = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext);
    if (!isImage) return next();

    const originalFilePath = path.join(uploadDir, filename);
    if (!fs.existsSync(originalFilePath)) return next();

    // Check query params for resizing
    const widthParam = req.query.w;
    const qualityParam = req.query.q;

    // If no query parameters, serve with browser cache headers
    if (!widthParam && !qualityParam) {
      res.setHeader("Cache-Control", "public, max-age=86400"); // 1 day
      return next();
    }

    try {
      const targetWidth = widthParam ? Math.min(Math.max(parseInt(widthParam, 10), 100), 2400) : null;
      const targetQuality = qualityParam ? Math.min(Math.max(parseInt(qualityParam, 10), 40), 95) : 80;

      const cacheDir = getCacheDir(uploadDir);
      const nameWithoutExt = path.basename(filename, ext);
      const cachedFileName = `${nameWithoutExt}-w${targetWidth || "orig"}-q${targetQuality}.webp`;
      const cachedFilePath = path.join(cacheDir, cachedFileName);

      // If cached version already exists, send directly
      if (fs.existsSync(cachedFilePath)) {
        res.setHeader("Content-Type", "image/webp");
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable"); // 1 year immutable
        return res.sendFile(cachedFilePath);
      }

      // Generate optimized WebP version using Sharp
      let pipeline = sharp(originalFilePath);

      if (targetWidth) {
        pipeline = pipeline.resize({
          width: targetWidth,
          withoutEnlargement: true,
          fit: "inside",
        });
      }

      pipeline = pipeline.webp({ quality: targetQuality, effort: 4 });

      await pipeline.toFile(cachedFilePath);

      res.setHeader("Content-Type", "image/webp");
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return res.sendFile(cachedFilePath);
    } catch (err) {
      console.error(`[ImageOptimizer] Failed to optimize ${filename}:`, err.message);
      // Fallback to original unoptimized image
      return next();
    }
  };
};

module.exports = {
  serveOptimizedImage,
};
