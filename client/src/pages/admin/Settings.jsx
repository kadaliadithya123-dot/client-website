import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiEye, HiEyeOff, HiPlus, HiTrash } from "react-icons/hi";
import api from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

const Settings = () => {
  const { admin } = useAuth();
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const savedOnceRef = useRef(false);
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [visiblePasswords, setVisiblePasswords] = useState({ current: false, next: false });
  const [pwSaving, setPwSaving] = useState(false);

  const normalizeSettings = (data) => {
    if (!data) return data;
    const phones =
      Array.isArray(data.phones) && data.phones.length > 0
        ? data.phones
        : data.phone
        ? data.phone.split(/[/|,]/).map((s) => s.trim()).filter(Boolean)
        : [""];
    const emails =
      Array.isArray(data.emails) && data.emails.length > 0
        ? data.emails
        : data.email
        ? data.email.split(/[,/|]/).map((s) => s.trim()).filter(Boolean)
        : [""];

    return {
      ...data,
      phones: phones.length > 0 ? phones : [""],
      emails: emails.length > 0 ? emails : [""],
    };
  };

  useEffect(() => {
    api
      .get("/settings")
      .then((res) => {
        if (!savedOnceRef.current) setSettings(normalizeSettings(res.data.data));
      })
      .catch(() => {});
  }, []);

  const handleChange = (field, value) => setSettings((s) => ({ ...s, [field]: value }));
  const handleSocialChange = (field, value) =>
    setSettings((s) => ({ ...s, social: { ...s.social, [field]: value } }));

  // Dynamic phone handlers
  const handlePhoneChange = (index, value) => {
    setSettings((s) => {
      const next = [...(s.phones || [""])];
      next[index] = value;
      return { ...s, phones: next };
    });
  };

  const handleAddPhone = () => {
    setSettings((s) => ({
      ...s,
      phones: [...(s.phones || []), ""],
    }));
  };

  const handleRemovePhone = (index) => {
    setSettings((s) => {
      const next = (s.phones || []).filter((_, i) => i !== index);
      return { ...s, phones: next.length > 0 ? next : [""] };
    });
  };

  // Dynamic email handlers
  const handleEmailChange = (index, value) => {
    setSettings((s) => {
      const next = [...(s.emails || [""])];
      next[index] = value;
      return { ...s, emails: next };
    });
  };

  const handleAddEmail = () => {
    setSettings((s) => ({
      ...s,
      emails: [...(s.emails || []), ""],
    }));
  };

  const handleRemoveEmail = (index) => {
    setSettings((s) => {
      const next = (s.emails || []).filter((_, i) => i !== index);
      return { ...s, emails: next.length > 0 ? next : [""] };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cleanedPhones = (settings.phones || []).map((p) => p.trim()).filter(Boolean);
      const cleanedEmails = (settings.emails || []).map((em) => em.trim()).filter(Boolean);

      const payload = {
        ...settings,
        phones: cleanedPhones,
        emails: cleanedEmails,
        phone: cleanedPhones.join(" / "),
        email: cleanedEmails.join(", "),
        studentsTrained: Number(settings.studentsTrained) || 0,
        projectsDelivered: Number(settings.projectsDelivered) || 0,
        industryPartners: Number(settings.industryPartners) || 0,
        branchesSupported: Number(settings.branchesSupported) || 0,
        studentsTrainedLabel: settings.studentsTrainedLabel || "Students Trained",
        projectsDeliveredLabel: settings.projectsDeliveredLabel || "Projects Delivered",
        industryPartnersLabel: settings.industryPartnersLabel || "Industry Partners",
        branchesSupportedLabel: settings.branchesSupportedLabel || "Branches Supported",
      };
      const res = await api.put("/settings", payload);
      savedOnceRef.current = true;
      setSettings(normalizeSettings(res.data.data));
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

      <form onSubmit={handleSave} className="space-y-5 rounded-lg border border-black/5 bg-white p-6">
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
            ["studentsTrained", "studentsTrainedLabel", "Students Trained"],
            ["projectsDelivered", "projectsDeliveredLabel", "Projects Delivered"],
            ["industryPartners", "industryPartnersLabel", "Industry Partners"],
            ["branchesSupported", "branchesSupportedLabel", "Branches Supported"],
          ].map(([numberField, labelField, defaultLabel]) => {
            const isAutoTracked = numberField === "branchesSupported";

            return (
              <div key={numberField} className="contents">
                <div>
                  <label className="text-xs text-steel">{isAutoTracked ? "Number (auto-tracked)" : "Number"}</label>
                  <input
                    type={isAutoTracked ? "text" : "number"}
                    min={isAutoTracked ? undefined : "0"}
                    value={isAutoTracked ? "Counts real page visits automatically" : settings[numberField] ?? ""}
                    onChange={isAutoTracked ? undefined : (e) => handleChange(numberField, e.target.value)}
                    disabled={isAutoTracked}
                    className={`mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none ${
                      isAutoTracked
                        ? "cursor-not-allowed bg-mist text-xs italic text-steel"
                        : "focus:border-brand-400"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs text-steel">Label</label>
                  <input
                    value={settings[labelField] ?? defaultLabel}
                    onChange={(e) => handleChange(labelField, e.target.value)}
                    className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="-mt-1 text-xs text-steel">
          The 4th stat's number now tracks real site visits automatically — only its label is editable.
        </p>

        {/* Contact Details with Dynamic Multi-fields */}
        <h2 className="pt-2 text-sm font-semibold uppercase tracking-wide text-steel">Contact Details</h2>
        <div>
          <label className="text-xs text-steel">Office Address</label>
          <input
            value={settings.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Address"
            className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
        </div>

        {/* Phone Numbers Multi-field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-steel">
              Phone Numbers ({settings.phones?.length || 0})
            </label>
            <button
              type="button"
              onClick={handleAddPhone}
              className="inline-flex items-center gap-1 rounded border border-brand-500/30 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-500 hover:text-white"
            >
              <HiPlus size={14} /> Add Phone
            </button>
          </div>

          <div className="space-y-2">
            {(settings.phones || [""]).map((phoneVal, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  value={phoneVal}
                  onChange={(e) => handlePhoneChange(idx, e.target.value)}
                  placeholder={`Phone ${idx + 1} (e.g. +91 99488 32456)`}
                  className="flex-1 rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
                />
                {(settings.phones || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePhone(idx)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-red-200 text-red-500 transition-colors hover:bg-red-50"
                    title="Remove phone number"
                    aria-label="Remove phone number"
                  >
                    <HiTrash size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Email Addresses Multi-field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-steel">
              Email Addresses ({settings.emails?.length || 0})
            </label>
            <button
              type="button"
              onClick={handleAddEmail}
              className="inline-flex items-center gap-1 rounded border border-brand-500/30 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-500 hover:text-white"
            >
              <HiPlus size={14} /> Add Email
            </button>
          </div>

          <div className="space-y-2">
            {(settings.emails || [""]).map((emailVal, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="email"
                  value={emailVal}
                  onChange={(e) => handleEmailChange(idx, e.target.value)}
                  placeholder={`Email ${idx + 1} (e.g. projects@sritechsolution.com)`}
                  className="flex-1 rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
                />
                {(settings.emails || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(idx)}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-red-200 text-red-500 transition-colors hover:bg-red-50"
                    title="Remove email address"
                    aria-label="Remove email address"
                  >
                    <HiTrash size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-steel">WhatsApp Number</label>
          <input
            value={settings.whatsapp || ""}
            onChange={(e) => handleChange("whatsapp", e.target.value)}
            placeholder="WhatsApp Number (e.g. +91 99488-32456)"
            className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
        </div>

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
