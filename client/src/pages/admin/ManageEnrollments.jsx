import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineTrash, HiOutlineSearch, HiOutlineMailOpen } from "react-icons/hi";
import api from "../../services/api.js";

const ManageEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  useEffect(() => {
    api
      .get("/courses", { params: { admin: true, limit: 100 } })
      .then((res) => setCourses(res.data.data))
      .catch(() => {});
  }, []);

  const fetchEnrollments = () => {
    setLoading(true);
    api
      .get("/enrollments", { params: { search, course: courseFilter || undefined, limit: 50 } })
      .then((res) => setEnrollments(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchEnrollments, [search, courseFilter]);

  const markRead = async (id) => {
    try {
      await api.put(`/enrollments/${id}/read`);
      setEnrollments((prev) => prev.map((enrollment) => (enrollment._id === id ? { ...enrollment, isRead: true } : enrollment)));
    } catch {
      toast.error("Failed to update enrollment");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this enrollment?")) return;
    try {
      await api.delete(`/enrollments/${id}`);
      toast.success("Enrollment deleted");
      fetchEnrollments();
    } catch {
      toast.error("Failed to delete enrollment");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-900">Course Enrollments</h1>
      <p className="mt-1 text-sm text-steel">Enrollment requests submitted from course pages.</p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-sm">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email or course..." className="w-full rounded-md border border-black/10 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-400" />
        </div>
        <div className="relative w-full sm:w-72">
          <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="w-full appearance-none rounded-md border border-black/10 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-navy-900 outline-none focus:border-brand-400">
            <option value="">All Courses</option>
            {courses.map((course) => <option key={course._id} value={course._id}>{course.title}</option>)}
          </select>
          <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-steel" width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {loading ? <p className="text-sm text-steel">Loading...</p> : enrollments.length === 0 ? <p className="text-sm text-steel">No enrollments found.</p> : enrollments.map((enrollment) => (
          <div key={enrollment._id} className={`rounded-lg border p-4 ${enrollment.isRead ? "border-black/5 bg-white" : "border-brand-200 bg-brand-50"}`}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-navy-900">{enrollment.name} {!enrollment.isRead && <span className="ml-2 rounded-full bg-brand-500 px-2 py-0.5 text-[10px] text-white">NEW</span>}</p>
                <p className="text-xs text-steel">{enrollment.email} • {enrollment.phone}</p>
                <p className="mt-1 text-xs font-medium text-brand-600">{enrollment.courseTitle}</p>
              </div>
              <div className="flex gap-2">
                {!enrollment.isRead && <button onClick={() => markRead(enrollment._id)} className="rounded-md p-2 text-brand-600 hover:bg-brand-100" title="Mark as read"><HiOutlineMailOpen /></button>}
                <button onClick={() => handleDelete(enrollment._id)} className="rounded-md p-2 text-red-500 hover:bg-red-50" title="Delete"><HiOutlineTrash /></button>
              </div>
            </div>
            {enrollment.message && <p className="mt-2 text-sm text-steel">{enrollment.message}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageEnrollments;
