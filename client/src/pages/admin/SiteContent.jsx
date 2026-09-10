import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineTrash, HiOutlinePlus, HiX } from "react-icons/hi";
import api from "../../services/api.js";

const emptyField = { key: "", label: "", page: "General", value: "" };

const parseJsonArray = (raw, fallback) => {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const TimelineEditor = ({ value, onChange }) => {
  const rows = parseJsonArray(value, []);
  const updateRow = (index, field, nextValue) => onChange(JSON.stringify(rows.map((row, rowIndex) => rowIndex === index ? { ...row, [field]: nextValue } : row)));
  const addRow = () => onChange(JSON.stringify([...rows, { year: "", text: "" }]));
  const removeRow = (index) => onChange(JSON.stringify(rows.filter((_, rowIndex) => rowIndex !== index)));
  const moveRow = (index, direction) => {
    const next = [...rows];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(JSON.stringify(next));
  };

  return (
    <div className="mt-3 space-y-3">
      {rows.map((row, index) => (
        <div key={index} className="rounded-md border border-black/10 p-3">
          <div className="flex items-center gap-2">
            <input placeholder="Year, e.g. 2026" value={row.year || ""} onChange={(e) => updateRow(index, "year", e.target.value)} className="w-28 rounded-md border border-black/10 px-2 py-1.5 text-sm outline-none focus:border-brand-400" />
            <div className="ml-auto flex gap-1">
              <button type="button" onClick={() => moveRow(index, -1)} disabled={index === 0} className="rounded p-1 text-steel hover:bg-mist disabled:opacity-30" title="Move up">Up</button>
              <button type="button" onClick={() => moveRow(index, 1)} disabled={index === rows.length - 1} className="rounded p-1 text-steel hover:bg-mist disabled:opacity-30" title="Move down">Down</button>
              <button type="button" onClick={() => removeRow(index)} className="rounded p-1 text-red-500 hover:bg-red-50" title="Remove"><HiOutlineTrash size={15} /></button>
            </div>
          </div>
          <textarea rows={2} placeholder="What happened this year" value={row.text || ""} onChange={(e) => updateRow(index, "text", e.target.value)} className="mt-2 w-full rounded-md border border-black/10 px-2 py-1.5 text-sm outline-none focus:border-brand-400" />
        </div>
      ))}
      <button type="button" onClick={addRow} className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"><HiOutlinePlus size={16} /> Add milestone</button>
    </div>
  );
};

const TagListEditor = ({ value, onChange }) => {
  const tags = parseJsonArray(value, []);
  const [draft, setDraft] = useState("");
  const addTag = () => {
    if (!draft.trim()) return;
    onChange(JSON.stringify([...tags, draft.trim()]));
    setDraft("");
  };
  const removeTag = (index) => onChange(JSON.stringify(tags.filter((_, tagIndex) => tagIndex !== index)));

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => <span key={index} className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">{tag}<button type="button" onClick={() => removeTag(index)} className="text-brand-400 hover:text-brand-600" title="Remove tag"><HiX size={12} /></button></span>)}
      </div>
      <div className="mt-2 flex gap-2">
        <input placeholder="Add a tag, e.g. Aerospace" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} className="flex-1 rounded-md border border-black/10 px-2 py-1.5 text-sm outline-none focus:border-brand-400" />
        <button type="button" onClick={addTag} className="btn-primary !px-3 !py-1.5 text-xs">Add</button>
      </div>
    </div>
  );
};

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
    api.get("/content/admin").then((res) => {
      setItems(res.data.data);
      setEditValues(Object.fromEntries(res.data.data.map((item) => [item.key, item.value])));
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(fetchItems, []);

  const handleSave = async (item) => {
    setSavingKey(item.key);
    try {
      await api.post("/content", { key: item.key, value: editValues[item.key] || "", page: item.page, label: item.label });
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

  const handleAddNew = async (e) => {
    e.preventDefault();
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
      <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-semibold text-navy-900">Site Content</h1><p className="mt-1 text-sm text-steel">Edit text used across the site. New fields must be referenced by their key in a page.</p></div><button onClick={() => setAddModalOpen(true)} className="btn-primary"><HiOutlinePlus /> Add Field</button></div>
      {loading ? <p className="mt-6 text-sm text-steel">Loading...</p> : items.length === 0 ? <p className="mt-6 text-sm text-steel">No content fields yet. Run the seed script or add one.</p> : Object.entries(grouped).map(([page, fields]) => (
        <div key={page} className="mt-8"><h2 className="text-sm font-semibold uppercase tracking-wide text-steel">{page}</h2><div className="mt-3 space-y-3">
          {fields.map((item) => <div key={item._id} className="rounded-lg border border-black/5 bg-white p-4">
            <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold text-navy-900">{item.label}</p><p className="text-xs text-steel">{item.key}</p></div><button onClick={() => handleDelete(item)} className="rounded-md p-1.5 text-red-500 hover:bg-red-50" title="Delete field"><HiOutlineTrash size={16} /></button></div>
            {item.key === "about.timeline" ? <TimelineEditor value={editValues[item.key]} onChange={(value) => setEditValues({ ...editValues, [item.key]: value })} /> : item.key === "about.industries" ? <TagListEditor value={editValues[item.key]} onChange={(value) => setEditValues({ ...editValues, [item.key]: value })} /> : <textarea rows={2} value={editValues[item.key] ?? ""} onChange={(e) => setEditValues({ ...editValues, [item.key]: e.target.value })} className="mt-3 w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400" />}
            <button onClick={() => handleSave(item)} disabled={savingKey === item.key} className="btn-primary mt-3 !px-4 !py-2 text-xs disabled:opacity-60">{savingKey === item.key ? "Saving..." : "Save"}</button>
          </div>)}
        </div></div>
      ))}

      {addModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-md rounded-lg bg-white p-6"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-navy-900">Add Content Field</h2><button onClick={() => setAddModalOpen(false)} className="text-steel hover:text-navy-900" aria-label="Close"><HiX size={22} /></button></div><form onSubmit={handleAddNew} className="mt-4 space-y-3">
        <label className="block text-xs font-medium text-steel">Key<input required placeholder="e.g. home.hero.title" value={newField.key} onChange={(e) => setNewField({ ...newField, key: e.target.value.trim() })} className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400" /></label>
        <label className="block text-xs font-medium text-steel">Label<input required placeholder="e.g. Hero headline" value={newField.label} onChange={(e) => setNewField({ ...newField, label: e.target.value })} className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400" /></label>
        <label className="block text-xs font-medium text-steel">Page grouping<input placeholder="e.g. Home, About, Footer" value={newField.page} onChange={(e) => setNewField({ ...newField, page: e.target.value })} className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400" /></label>
        <label className="block text-xs font-medium text-steel">Value<textarea rows={3} value={newField.value} onChange={(e) => setNewField({ ...newField, value: e.target.value })} className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400" /></label>
        <button type="submit" disabled={adding} className="btn-primary w-full disabled:opacity-60">{adding ? "Adding..." : "Add Field"}</button>
      </form></div></div>}
    </div>
  );
};

export default SiteContent;