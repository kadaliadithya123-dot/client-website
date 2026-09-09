import { useEffect, useState } from "react";
import {
  HiOutlineAcademicCap,
  HiOutlineCube,
  HiOutlinePhotograph,
  HiOutlineMail,
  HiOutlineClipboardList,
} from "react-icons/hi";
import api from "../../services/api.js";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-lg border border-black/5 bg-white p-6">
    <div className="grid h-11 w-11 place-items-center rounded-md bg-brand-50 text-brand-600">
      <Icon size={22} />
    </div>
    <p className="mt-4 text-2xl font-semibold text-navy-900">{value}</p>
    <p className="text-sm text-steel">{label}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("/dashboard/stats")
      .then((res) => setStats(res.data.data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy-900">Dashboard</h1>
      <p className="mt-1 text-sm text-steel">A quick overview of your site content.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={HiOutlineAcademicCap} label="Total Courses" value={stats?.totalCourses ?? "-"} />
        <StatCard icon={HiOutlineCube} label="Total Projects" value={stats?.totalProjects ?? "-"} />
        <StatCard icon={HiOutlinePhotograph} label="Gallery Images" value={stats?.totalGalleryImages ?? "-"} />
        <StatCard icon={HiOutlineMail} label="Contact Messages" value={stats?.totalMessages ?? "-"} />
        <StatCard icon={HiOutlineClipboardList} label="Total Enrollments" value={stats?.totalEnrollments ?? "-"} />
      </div>

      {stats?.unreadMessages > 0 && (
        <div className="mt-6 rounded-lg border border-brand-200 bg-brand-50 p-4 text-sm text-brand-700">
          You have {stats.unreadMessages} unread message{stats.unreadMessages > 1 ? "s" : ""}.
        </div>
      )}
    </div>
  );
};

export default Dashboard;
