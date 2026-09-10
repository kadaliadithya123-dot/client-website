import { useCallback, useEffect, useRef, useState } from "react";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import api from "../services/api.js";
import { useContent } from "../hooks/useContent.js";

const Gallery = () => {
  const { content } = useContent();
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    api.get("/gallery-categories").then((res) => setCategories(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setImages([]);
    setPage(1);
    setHasMore(true);
  }, [category]);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12 };
    if (category) params.category = category;

    api
      .get("/gallery", { params })
      .then((res) => {
        setImages((prev) => (page === 1 ? res.data.data : [...prev, ...res.data.data]));
        setHasMore(res.data.pagination.hasMore);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, page]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) setPage((p) => p + 1);
      },
      { threshold: 1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showNext = useCallback(() => setLightboxIndex((i) => (i + 1) % images.length), [images.length]);
  const showPrev = useCallback(() => setLightboxIndex((i) => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, closeLightbox, showNext, showPrev]);

  return (
    <div>
      <section className="bg-navy-950 py-14 text-white">
        <div className="container-page">
          <span className="eyebrow text-brand-400">{content["gallery.header_eyebrow"] || "Gallery"}</span>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{content["gallery.header_title"] || "Events, workshops and life in the lab"}</h1>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setCategory("")} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${category === "" ? "bg-brand-500 text-white" : "bg-mist text-steel hover:bg-brand-50"}`}>All</button>
          {categories.map((cat) => (
            <button key={cat._id} onClick={() => setCategory(cat.name)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${category === cat.name ? "bg-brand-500 text-white" : "bg-mist text-steel hover:bg-brand-50"}`}>
              {cat.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <button key={img._id} onClick={() => setLightboxIndex(i)} className="group relative aspect-square overflow-hidden rounded-lg bg-navy-800">
              <img src={img.image} alt={img.title || img.category} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              {img.title && <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-left"><p className="line-clamp-2 text-xs text-white">{img.title}</p></div>}
            </button>
          ))}
        </div>

        {images.length === 0 && !loading && <p className="py-16 text-center text-steel">No images in this category yet.</p>}
        <div ref={loaderRef} className="h-10" />
        {loading && <p className="text-center text-sm text-steel">Loading more...</p>}
      </section>

      {lightboxIndex !== null && images[lightboxIndex] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={closeLightbox}>
          <button className="absolute right-5 top-5 text-white/80 hover:text-white" onClick={closeLightbox} aria-label="Close"><HiX size={28} /></button>
          <button className="absolute left-3 text-white/70 hover:text-white sm:left-6" onClick={(e) => { e.stopPropagation(); showPrev(); }} aria-label="Previous image"><HiChevronLeft size={32} /></button>
          <div className="flex max-h-[90vh] max-w-[90vw] flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img src={images[lightboxIndex].image} alt="" className="max-h-[80vh] max-w-full rounded-md object-contain" />
            {images[lightboxIndex].title && <p className="mt-3 max-w-lg text-center text-sm text-white/80">{images[lightboxIndex].title}</p>}
          </div>
          <button className="absolute right-3 text-white/70 hover:text-white sm:right-6" onClick={(e) => { e.stopPropagation(); showNext(); }} aria-label="Next image"><HiChevronRight size={32} /></button>
        </div>
      )}
    </div>
  );
};

export default Gallery;