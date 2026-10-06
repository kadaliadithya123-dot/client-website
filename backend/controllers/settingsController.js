const Settings = require("../models/Settings");

const STAT_DEFAULTS = {
  studentsTrained: 500,
  projectsDelivered: 120,
  industryPartners: 15,
  branchesSupported: 8,
};
const STAT_LABEL_DEFAULTS = {
  studentsTrainedLabel: "Students Trained",
  projectsDeliveredLabel: "Projects Delivered",
  industryPartnersLabel: "Industry Partners",
  branchesSupportedLabel: "Branches Supported",
};

const syncStats = (settings) => {
  const merged = {
    ...STAT_DEFAULTS,
    ...(settings.stats?.toObject?.() || settings.stats || {}),
    ...(Object.fromEntries(
      Object.keys(STAT_DEFAULTS).map((key) => [key, settings[key]])
    )),
  };

  Object.keys(STAT_DEFAULTS).forEach((key) => {
    const value = merged[key] ?? STAT_DEFAULTS[key];
    settings[key] = Number(value) || 0;
    settings.stats = { ...(settings.stats?.toObject?.() || settings.stats || {}), [key]: Number(value) || 0 };
  });

  Object.entries(STAT_LABEL_DEFAULTS).forEach(([key, defaultValue]) => {
    settings[key] = settings[key] || defaultValue;
  });

  return settings;
};

// Ensure a single settings document exists and return it.
// Also backfills any stat fields missing from an older document, so a
// schema addition never silently shows as 0/undefined on the frontend.
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }

  syncStats(settings);

  let changed = false;
  for (const [key, defaultValue] of Object.entries(STAT_DEFAULTS)) {
    if (settings[key] === undefined || settings[key] === null || settings.stats?.[key] === undefined || settings.stats?.[key] === null) {
      settings[key] = defaultValue;
      settings.stats[key] = defaultValue;
      changed = true;
    }
  }

  for (const [key, defaultValue] of Object.entries(STAT_LABEL_DEFAULTS)) {
    if (!settings[key]) {
      settings[key] = defaultValue;
      changed = true;
    }
  }

  if (!settings.phones || settings.phones.length === 0) {
    if (settings.phone) {
      settings.phones = settings.phone.split(/[/|,]/).map((s) => s.trim()).filter(Boolean);
    } else {
      settings.phones = ["+91 99488 32456", "+91 86886 32456"];
    }
    changed = true;
  }

  if (!settings.emails || settings.emails.length === 0) {
    if (settings.email) {
      settings.emails = settings.email.split(/[,|/]/).map((s) => s.trim()).filter(Boolean);
    } else {
      settings.emails = ["sritechsolutions9@gmail.com"];
    }
    changed = true;
  }

  if (changed) await settings.save();
  else await settings.save();

  return settings;
};

// @desc  Get site settings
// @route GET /api/settings
const getSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

// Only these fields can ever be written by a client. Everything else in the
// request body, including persisted document metadata, is ignored.
const EDITABLE_FIELDS = [
  "companyName",
  "tagline",
  "about",
  "address",
  "phone",
  "phones",
  "email",
  "emails",
  "whatsapp",
  "mapEmbedUrl",
  "studentsTrained",
  "projectsDelivered",
  "industryPartners",
  "branchesSupported",
  "studentsTrainedLabel",
  "projectsDeliveredLabel",
  "industryPartnersLabel",
  "branchesSupportedLabel",
];
const EDITABLE_SOCIAL_FIELDS = ["facebook", "instagram", "linkedin", "youtube", "twitter"];
const NUMERIC_FIELDS = ["studentsTrained", "projectsDelivered", "industryPartners", "branchesSupported"];

// @desc  Update site settings
// @route PUT /api/settings
// @access Private
const updateSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();

    for (const field of EDITABLE_FIELDS) {
      if (req.body[field] === undefined) continue;
      settings[field] = NUMERIC_FIELDS.includes(field) ? Number(req.body[field]) || 0 : req.body[field];
    }

    if (Array.isArray(req.body.phones)) {
      settings.phones = req.body.phones.map((p) => String(p).trim()).filter(Boolean);
      settings.phone = settings.phones.join(" / ");
    }
    if (Array.isArray(req.body.emails)) {
      settings.emails = req.body.emails.map((e) => String(e).trim()).filter(Boolean);
      settings.email = settings.emails.join(", ");
    }

    if (req.body.social && typeof req.body.social === "object") {
      for (const field of EDITABLE_SOCIAL_FIELDS) {
        if (req.body.social[field] !== undefined) {
          settings.social[field] = req.body.social[field];
        }
      }
    }

    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSettings, updateSettings };
