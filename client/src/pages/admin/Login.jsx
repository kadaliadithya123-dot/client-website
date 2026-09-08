import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";

const Login = () => {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  if (admin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-navy-950 px-4">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="text-center">
          <span className="grid mx-auto h-11 w-11 place-items-center rounded-md bg-brand-500 font-display text-lg font-bold text-white">
            ST
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold text-white">Admin Login</h1>
          <p className="mt-1 text-sm text-mist/60">SriTech Embedded Projects</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-mist/80">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-mist/80">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-brand-400"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
