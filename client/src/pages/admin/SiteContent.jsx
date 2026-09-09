import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlinePlus, HiOutlineTrash, HiX } from "react-icons/hi";
import api from "../../services/api.js";

const emptyField = { key: "", label: "", page: "General", value: "" };

const SiteContent = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editValues, setEditValues] = useState({});
  const [savingKey, setSavingKey] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newField, setNewField] = useState(emptyField);
  const [adding, setAdding] = useState(false);

  const fetchItems = () => {
    setLoading(true);
    api
      .get("/content/admin")
      .then((res) => {
        setItems(res.data.data);
        setEditValues(Object.fromEntries(res.data.data.map((item) => [item.key, item.value])));
      })
      .catch(() => toast.error("Failed to load content"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async (item) => {
    setSavingKey(item.key);
    try {
      await api.post("/content", {
        key: item.key,
        value: editValues[item.key] || "",
        page: item.page,
        label: item.label,
      });
      toast.success(`"${item.label}" updated`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSavingKey(null);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.label}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/content/${item._id}`);
      toast.success("Field deleted");
      fetchItems();
    } catch {
      toast.error("Failed to delete field");
    }
  };

  const handleAddNew = async (event) => {
    event.preventDefault();
    if (!newField.key.trim() || !newField.label.trim()) {
      toast.error("Key and label are required");
      return;
    }

    setAdding(true);
    try {
      await api.post("/content", newField);
      toast.success("New field added");
      setAddModalOpen(false);
      setNewField(emptyField);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add field");
    } finally {
      setAdding(false);
    }
  };

  const grouped = items.reduce((groups, item) => {
    groups[item.page] = groups[item.page] || [];
    groups[item.page].push(item);
    return groups;
  }, {});

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-navy-900">Site Content</h1>
          <p className="mt-1 text-sm text-steel">
            Edit text used across the site. New fields must be referenced by their key in a page.
          </p>
        </div>
        <button onClick={() => setAddModalOpen(true)} className="btn-primary">
          <HiOutlinePlus /> Add Field
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-steel">Loading...</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-steel">No content fields yet. Run the seed script or add one.</p>
      ) : (
        Object.entries(grouped).map(([page, fields]) => (
          <div key={page} className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-steel">{page}</h2>
            <div className="mt-3 space-y-3">
              {fields.map((item) => (
                <div key={item._id} className="rounded-lg border border-black/5 bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-navy-900">{item.label}</p>
                      <p className="text-xs text-steel">{item.key}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(item)}
                      className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                      title="Delete field"
                      aria-label={`Delete ${item.label}`}
                    >
                      <HiOutlineTrash size={16} />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={editValues[item.key] ?? ""}
                    onChange={(event) => setEditValues({ ...editValues, [item.key]: event.target.value })}
                    className="mt-3 w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
                  />
                  <button
                    onClick={() => handleSave(item)}
                    disabled={savingKey === item.key}
                    className="btn-primary mt-2 !px-4 !py-2 text-xs disabled:opacity-60"
                  >
                    {savingKey === item.key ? "Saving..." : "Save"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy-900">Add Content Field</h2>
              <button onClick={() => setAddModalOpen(false)} className="text-steel hover:text-navy-900" aria-label="Close">
                <HiX size={22} />
              </button>
            </div>
            <form onSubmit={handleAddNew} className="mt-4 space-y-3">
              <label className="block text-xs font-medium text-steel">
                Key
                <input
                  required
                  placeholder="e.g. home.hero.title"
                  value={newField.key}
                  onChange={(event) => setNewField({ ...newField, key: event.target.value.trim() })}
                  className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
                />
              </label>
              <label className="block text-xs font-medium text-steel">
                Label
                <input
                  required
                  placeholder="e.g. Hero headline"
                  value={newField.label}
                  onChange={(event) => setNewField({ ...newField, label: event.target.value })}
                  className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
                />
              </label>
              <label className="block text-xs font-medium text-steel">
                Page grouping
                <input
                  placeholder="e.g. Home, About, Footer"
                  value={newField.page}
                  onChange={(event) => setNewField({ ...newField, page: event.target.value })}
                  className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
                />
              </label>
              <label className="block text-xs font-medium text-steel">
                Value
                <textarea
                  rows={3}
                  value={newField.value}
                  onChange={(event) => setNewField({ ...newField, value: event.target.value })}
                  className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
                />
              </label>
              <button type="submit" disabled={adding} className="btn-primary w-full disabled:opacity-60">
                {adding ? "Adding..." : "Add Field"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteContent;
