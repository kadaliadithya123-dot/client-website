import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiX } from "react-icons/hi";
import api from "../../services/api.js";

const emptyForm = {
  title: "",
  description: "",
  duration: "",
  fee: "",
  level: "Beginner",
  trainer: "",
  technologies: "",
  syllabus: "",
  eligibility: "",
};

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchCourses = () => {
    setLoading(true);
    api
      .get("/courses", { params: { admin: true, search, limit: 50 } })
      .then((res) => setCourses(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchCourses, [search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setCurrentImage("");
    setRemoveImage(false);
    setModalOpen(true);
  };

  const openEdit = (course) => {
    setEditing(course);
    setForm({
      title: course.title,
      description: course.description,
      duration: course.duration,
      fee: course.fee,
      level: course.level,
      trainer: course.trainer || "",
      technologies: (course.technologies || []).join(", "),
      syllabus: (course.syllabus || []).join("\n"),
      eligibility: course.eligibility || "",
    });
    setImageFile(null);
    setCurrentImage(course.image || "");
    setRemoveImage(false);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (imageFile) data.append("image", imageFile);
      if (editing) data.append("removeImage", removeImage ? "true" : "false");

      if (editing) {
        await api.put(`/courses/${editing._id}`, data);
        toast.success("Course updated");
      } else {
        await api.post("/courses", data);
        toast.success("Course created");
      }
      setModalOpen(false);
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success("Course deleted");
      fetchCourses();
    } catch {
      toast.error("Failed to delete course");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-navy-900">Manage Courses</h1>
          <p className="mt-1 text-sm text-steel">Create, edit and remove training courses.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <HiOutlinePlus /> New Course
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search courses..."
        className="mt-5 w-full max-w-sm rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-400"
      />

      <div className="mt-5 overflow-x-auto rounded-lg border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-mist text-xs uppercase text-steel">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-steel">Loading...</td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-steel">No courses found.</td>
              </tr>
            ) : (
              courses.map((c) => (
                <tr key={c._id} className="border-t border-black/5">
                  <td className="px-4 py-3 font-medium text-navy-900">{c.title}</td>
                  <td className="px-4 py-3">{c.level}</td>
                  <td className="px-4 py-3">₹{c.fee}</td>
                  <td className="px-4 py-3">{c.duration}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(c)} className="rounded-md p-2 text-brand-600 hover:bg-brand-50">
                        <HiOutlinePencil />
                      </button>
                      <button onClick={() => handleDelete(c._id)} className="rounded-md p-2 text-red-500 hover:bg-red-50">
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-navy-900">{editing ? "Edit Course" : "New Course"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-steel hover:text-navy-900">
                <HiX size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                required
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
              <textarea
                required
                rows={3}
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Duration (e.g. 6 Weeks)"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
                />
                <input
                  required
                  type="number"
                  placeholder="Fee"
                  value={form.fee}
                  onChange={(e) => setForm({ ...form, fee: e.target.value })}
                  className="rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
                />
              </div>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
              <input
                placeholder="Trainer"
                value={form.trainer}
                onChange={(e) => setForm({ ...form, trainer: e.target.value })}
                className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
              <input
                placeholder="Technologies (comma separated)"
                value={form.technologies}
                onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
              <textarea
                rows={3}
                placeholder="Syllabus (one item per line)"
                value={form.syllabus}
                onChange={(e) => setForm({ ...form, syllabus: e.target.value })}
                className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
              <input
                placeholder="Eligibility"
                value={form.eligibility}
                onChange={(e) => setForm({ ...form, eligibility: e.target.value })}
                className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
              />
              <div>
                <label className="text-xs font-medium text-steel">Course Image</label>
                {currentImage && !removeImage && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={currentImage} alt="Current course" className="h-16 w-16 rounded-md object-cover" />
                    <button
                      type="button"
                      onClick={() => setRemoveImage(true)}
                      className="text-xs font-medium text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {removeImage && (
                  <p className="mt-2 text-xs text-steel">
                    Image will be removed on save.{" "}
                    <button type="button" onClick={() => setRemoveImage(false)} className="font-medium text-brand-600">
                      Undo
                    </button>
                  </p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setImageFile(e.target.files[0]);
                    setRemoveImage(false);
                  }}
                  className="mt-2 w-full text-sm"
                />
              </div>

              <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
                {saving ? "Saving..." : editing ? "Update Course" : "Create Course"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
