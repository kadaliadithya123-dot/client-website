import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineTrash, HiOutlineUpload, HiOutlineCog, HiOutlinePencil, HiX, HiCheck } from "react-icons/hi";
import api from "../../services/api.js";

const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [categoryPanelOpen, setCategoryPanelOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [editingImage, setEditingImage] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchImages = () => {
    setLoading(true);
    api
      .get("/gallery", { params: { category: filter || undefined, limit: 100 } })
      .then((res) => setImages(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const fetchCategories = () => {
    api
      .get("/gallery-categories")
      .then((res) => {
        setCategories(res.data.data);
        if (!category && res.data.data.length) setCategory(res.data.data[0].name);
      })
      .catch(() => {});
  };

  useEffect(fetchImages, [filter]);
  useEffect(fetchCategories, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!files?.length) {
      toast.error("Choose at least one image");
      return;
    }
    if (!category) {
      toast.error("Add a category before uploading");
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      data.append("category", category);
      Array.from(files).forEach((file) => data.append("images", file));
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

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setAddingCategory(true);
    try {
      await api.post("/gallery-categories", { name: newCategory.trim() });
      toast.success("Category added");
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category");
    } finally {
      setAddingCategory(false);
    }
  };

  const startRename = (cat) => {
    setRenamingId(cat._id);
    setRenameValue(cat.name);
  };

  const saveRename = async (cat) => {
    if (!renameValue.trim()) return;
    try {
      await api.put(`/gallery-categories/${cat._id}`, { name: renameValue.trim() });
      toast.success("Category renamed");
      setRenamingId(null);
      fetchCategories();
      fetchImages();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to rename category");
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    try {
      await api.delete(`/gallery-categories/${cat._id}`);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  const openEditImage = (img) => {
    setEditingImage(img);
    setEditTitle(img.title || "");
    setEditCategory(img.category);
  };

  const saveImageEdit = async () => {
    setSavingEdit(true);
    try {
      await api.put(`/gallery/${editingImage._id}`, { title: editTitle, category: editCategory });
      toast.success("Image updated");
      setEditingImage(null);
      fetchImages();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update image");
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-navy-900">Manage Gallery</h1>
          <p className="mt-1 text-sm text-steel">Upload photos, add captions, and organize by category.</p>
        </div>
        <button onClick={() => setCategoryPanelOpen(true)} className="btn-outline !border-black/10 !text-navy-900 hover:!bg-mist">
          <HiOutlineCog /> Manage Categories
        </button>
      </div>

      <form onSubmit={handleUpload} className="mt-5 flex flex-wrap items-end gap-3 rounded-lg border border-black/5 bg-white p-4">
        <div>
          <label className="text-xs font-medium text-steel">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400">
            {categories.map((cat) => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
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
      <p className="mt-2 text-xs text-steel">Uploads apply the same category to every file at once. To add a caption to a specific photo, upload it, then click the pencil icon on that image below.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button onClick={() => setFilter("")} className={`rounded-full px-4 py-1.5 text-sm font-medium ${filter === "" ? "bg-brand-500 text-white" : "bg-mist text-steel"}`}>All</button>
        {categories.map((cat) => (
          <button key={cat._id} onClick={() => setFilter(cat.name)} className={`rounded-full px-4 py-1.5 text-sm font-medium ${filter === cat.name ? "bg-brand-500 text-white" : "bg-mist text-steel"}`}>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {loading ? <p className="text-sm text-steel">Loading...</p> : images.length === 0 ? <p className="text-sm text-steel">No images yet.</p> : images.map((img) => (
          <div key={img._id} className="group relative aspect-square overflow-hidden rounded-lg bg-navy-800">
            <img src={img.image} alt={img.title || img.category} className="h-full w-full object-cover" />
            {img.title && <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2"><p className="line-clamp-2 text-[11px] text-white">{img.title}</p></div>}
            <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button onClick={() => openEditImage(img)} className="grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white" title="Edit caption/category"><HiOutlinePencil size={15} /></button>
              <button onClick={() => handleDelete(img._id)} className="grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white" title="Delete"><HiOutlineTrash size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      {categoryPanelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-navy-900">Manage Categories</h2><button onClick={() => setCategoryPanelOpen(false)} className="text-steel hover:text-navy-900"><HiX size={22} /></button></div>
            <form onSubmit={handleAddCategory} className="mt-4 flex gap-2">
              <input placeholder="New category, e.g. Hackathons" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="flex-1 rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400" />
              <button type="submit" disabled={addingCategory} className="btn-primary !px-4 disabled:opacity-60">{addingCategory ? "Adding..." : "Add"}</button>
            </form>
            <div className="mt-4 max-h-64 space-y-1 overflow-y-auto">
              {categories.length === 0 ? <p className="text-sm text-steel">No categories yet - add one above.</p> : categories.map((cat) => (
                <div key={cat._id} className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-mist">
                  {renamingId === cat._id ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input autoFocus value={renameValue} onChange={(e) => setRenameValue(e.target.value)} className="flex-1 rounded-md border border-black/10 px-2 py-1 text-sm outline-none focus:border-brand-400" />
                      <button onClick={() => saveRename(cat)} className="rounded-md p-1.5 text-brand-600 hover:bg-brand-50" title="Save"><HiCheck size={16} /></button>
                      <button onClick={() => setRenamingId(null)} className="rounded-md p-1.5 text-steel hover:bg-mist" title="Cancel"><HiX size={16} /></button>
                    </div>
                  ) : (
                    <><span className="text-navy-900">{cat.name}</span><div className="flex gap-1"><button onClick={() => startRename(cat)} className="rounded-md p-1.5 text-brand-600 hover:bg-brand-50" title="Rename"><HiOutlinePencil size={15} /></button><button onClick={() => handleDeleteCategory(cat)} className="rounded-md p-1.5 text-red-500 hover:bg-red-50" title="Delete"><HiOutlineTrash size={15} /></button></div></>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-steel">A category cannot be deleted while images still use it. Reassign or delete those images first.</p>
          </div>
        </div>
      )}

      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6">
            <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-navy-900">Edit Image</h2><button onClick={() => setEditingImage(null)} className="text-steel hover:text-navy-900"><HiX size={22} /></button></div>
            <img src={editingImage.image} alt="" className="mt-3 h-32 w-full rounded-md object-cover" />
            <div className="mt-4 space-y-3">
              <label className="block text-xs font-medium text-steel">Caption<input placeholder="e.g. Robotics workshop, Jan 2026" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400" /></label>
              <label className="block text-xs font-medium text-steel">Category<select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400">{categories.map((cat) => <option key={cat._id} value={cat.name}>{cat.name}</option>)}</select></label>
              <button onClick={saveImageEdit} disabled={savingEdit} className="btn-primary w-full disabled:opacity-60">{savingEdit ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGallery;