import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineTrash, HiOutlineUpload } from "react-icons/hi";
import api from "../../services/api.js";

const categories = ["Events", "Workshops", "Projects", "Labs", "Students"];

const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState("Events");
  const [files, setFiles] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchImages = () => {
    setLoading(true);
    api
      .get("/gallery", { params: { category: filter || undefined, limit: 100 } })
      .then((res) => setImages(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchImages, [filter]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files?.length) {
      toast.error("Choose at least one image");
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      data.append("category", category);
      Array.from(files).forEach((f) => data.append("images", f));
      await api.post("/gallery", data);
      toast.success("Images uploaded");
      setFiles(null);
      fetchImages();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast.success("Image deleted");
      fetchImages();
    } catch {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-900">Manage Gallery</h1>
      <p className="mt-1 text-sm text-steel">Upload and organize photos by category.</p>

      <form onSubmit={handleUpload} className="mt-5 flex flex-wrap items-end gap-3 rounded-lg border border-black/5 bg-white p-4">
        <div>
          <label className="text-xs font-medium text-steel">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-steel">Images</label>
          <input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} className="mt-1 block text-sm" />
        </div>
        <button type="submit" disabled={uploading} className="btn-primary disabled:opacity-60">
          <HiOutlineUpload /> {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${filter === "" ? "bg-brand-500 text-white" : "bg-mist text-steel"}`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${filter === c ? "bg-brand-500 text-white" : "bg-mist text-steel"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {loading ? (
          <p className="text-sm text-steel">Loading...</p>
        ) : images.length === 0 ? (
          <p className="text-sm text-steel">No images yet.</p>
        ) : (
          images.map((img) => (
            <div key={img._id} className="group relative aspect-square overflow-hidden rounded-lg bg-navy-800">
              <img src={img.image} alt={img.category} className="h-full w-full object-cover" />
              <button
                onClick={() => handleDelete(img._id)}
                className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <HiOutlineTrash size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageGallery;
