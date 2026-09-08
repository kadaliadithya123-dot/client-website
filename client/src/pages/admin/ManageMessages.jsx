import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineTrash, HiOutlineSearch, HiOutlineMailOpen } from "react-icons/hi";
import api from "../../services/api.js";

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchMessages = () => {
    setLoading(true);
    api
      .get("/contact", { params: { search, limit: 50 } })
      .then((res) => setMessages(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchMessages, [search]);

  const markRead = async (id) => {
    try {
      await api.put(`/contact/${id}/read`);
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, isRead: true } : m)));
    } catch {
      toast.error("Failed to update message");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/contact/${id}`);
      toast.success("Message deleted");
      fetchMessages();
    } catch {
      toast.error("Failed to delete message");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-900">Contact Messages</h1>
      <p className="mt-1 text-sm text-steel">Messages submitted through the website contact form.</p>

      <div className="relative mt-5 max-w-sm">
        <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search messages..."
          className="w-full rounded-md border border-black/10 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-400"
        />
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <p className="text-sm text-steel">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-steel">No messages found.</p>
        ) : (
          messages.map((m) => (
            <div
              key={m._id}
              className={`rounded-lg border p-4 ${m.isRead ? "border-black/5 bg-white" : "border-brand-200 bg-brand-50"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-navy-900">
                    {m.name} {!m.isRead && <span className="ml-2 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] text-white">NEW</span>}
                  </p>
                  <p className="text-xs text-steel">
                    {m.email} • {m.phone}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!m.isRead && (
                    <button onClick={() => markRead(m._id)} className="rounded-md p-2 text-brand-600 hover:bg-brand-100" title="Mark as read">
                      <HiOutlineMailOpen />
                    </button>
                  )}
                  <button onClick={() => handleDelete(m._id)} className="rounded-md p-2 text-red-500 hover:bg-red-50" title="Delete">
                    <HiOutlineTrash />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm font-medium text-navy-900">{m.subject}</p>
              <p className="mt-1 text-sm text-steel">{m.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageMessages;
