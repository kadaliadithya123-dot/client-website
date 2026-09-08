const Settings = require("../models/Settings");

// Ensure a single settings document exists and return it
const getOrCreateSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) settings = await Settings.create({});
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

// @desc  Update site settings
// @route PUT /api/settings
// @access Private
const updateSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    Object.assign(settings, req.body);
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSettings, updateSettings };
