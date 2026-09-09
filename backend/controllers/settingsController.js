const Settings = require("../models/Settings");

const STAT_DEFAULTS = {
  studentsTrained: 500,
  projectsDelivered: 120,
  industryPartners: 15,
  branchesSupported: 8,
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
  "email",
  "whatsapp",
  "mapEmbedUrl",
  "studentsTrained",
  "projectsDelivered",
  "industryPartners",
  "branchesSupported",
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
