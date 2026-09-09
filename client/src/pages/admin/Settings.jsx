import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiEye, HiEyeOff } from "react-icons/hi";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const Settings = () => {
  const { admin } = useAuth();
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [visiblePasswords, setVisiblePasswords] = useState({ current: false, next: false });
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => setSettings(res.data.data))
      .catch(() => {});
  }, []);

  const handleChange = (field, value) => setSettings((s) => ({ ...s, [field]: value }));
  const handleSocialChange = (field, value) =>
    setSettings((s) => ({ ...s, social: { ...s.social, [field]: value } }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/settings", settings);
      setSettings(res.data.data);
      toast.success("Settings updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwSaving(true);
    try {
      await api.put("/auth/change-password", pw);
      toast.success("Password changed");
      setPw({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setPwSaving(false);
    }
  };

  const togglePassword = (field) =>
    setVisiblePasswords((visible) => ({ ...visible, [field]: !visible[field] }));

  if (!settings) return <p className="text-sm text-steel">Loading...</p>;

  return (
    <div className="max-w-2xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-navy-900">Settings</h1>
        <p className="mt-1 text-sm text-steel">Signed in as {admin?.email}</p>
      </div>

      <form onSubmit={handleSave} className="space-y-4 rounded-lg border border-black/5 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-steel">Company Information</h2>
        <input
          value={settings.companyName || ""}
          onChange={(e) => handleChange("companyName", e.target.value)}
          placeholder="Company Name"
          className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
        <input
          value={settings.tagline || ""}
          onChange={(e) => handleChange("tagline", e.target.value)}
          placeholder="Tagline"
          className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
        <textarea
          rows={3}
          value={settings.about || ""}
          onChange={(e) => handleChange("about", e.target.value)}
          placeholder="About"
          className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />

        <h2 className="pt-2 text-sm font-semibold uppercase tracking-wide text-steel">Homepage Stats</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["studentsTrained", "Students Trained"],
            ["projectsDelivered", "Projects Delivered"],
            ["industryPartners", "Industry Partners"],
            ["branchesSupported", "Branches Supported"],
          ].map(([field, label]) => (
            <input
              key={field}
              type="number"
              min="0"
              value={settings[field] ?? ""}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={label}
              aria-label={label}
              className="rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
          ))}
        </div>

        <h2 className="pt-2 text-sm font-semibold uppercase tracking-wide text-steel">Contact Details</h2>
        <input
          value={settings.address || ""}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Address"
          className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            value={settings.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Phone"
            className="rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
          <input
            value={settings.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Email"
            className="rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
        </div>
        <input
          value={settings.whatsapp || ""}
          onChange={(e) => handleChange("whatsapp", e.target.value)}
          placeholder="WhatsApp Number"
          className="w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />

        <h2 className="pt-2 text-sm font-semibold uppercase tracking-wide text-steel">Social Media Links</h2>
        <div className="grid grid-cols-2 gap-3">
          {["facebook", "instagram", "linkedin", "youtube"].map((key) => (
            <input
              key={key}
              value={settings.social?.[key] || ""}
              onChange={(e) => handleSocialChange(key, e.target.value)}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              className="rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
          ))}
        </div>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <form onSubmit={handlePasswordChange} className="space-y-4 rounded-lg border border-black/5 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-steel">Change Password</h2>
        {[{ key: "current", field: "currentPassword", label: "Current Password", minLength: undefined }, { key: "next", field: "newPassword", label: "New Password", minLength: 6 }].map(({ key, field, label, minLength }) => (
          <div key={field} className="relative">
            <input
              type={visiblePasswords[key] ? "text" : "password"}
              required
              minLength={minLength}
              value={pw[field]}
              onChange={(e) => setPw({ ...pw, [field]: e.target.value })}
              placeholder={label}
              className="w-full rounded-md border border-black/10 px-3 py-2 pr-10 text-sm outline-none focus:border-brand-400"
            />
            <button
              type="button"
              onClick={() => togglePassword(key)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-steel transition-colors hover:text-navy-900"
              aria-label={visiblePasswords[key] ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            >
              {visiblePasswords[key] ? <HiEyeOff size={18} /> : <HiEye size={18} />}
            </button>
          </div>
        ))}
        <button type="submit" disabled={pwSaving} className="btn-primary disabled:opacity-60">
          {pwSaving ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
