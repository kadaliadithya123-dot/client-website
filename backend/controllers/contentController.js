const Content = require("../models/Content");

const getContentMap = async (req, res, next) => {
  try {
    const items = await Content.find().lean();
    const map = Object.fromEntries(items.map((item) => [item.key, item.value]));
    res.json({ success: true, data: map });
  } catch (err) {
    next(err);
  }
};

const getContentList = async (req, res, next) => {
  try {
    const items = await Content.find().sort({ page: 1, key: 1 });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

const upsertContent = async (req, res, next) => {
  try {
    const key = req.body.key?.trim();
    if (!key) {
      res.status(400);
      throw new Error("Key is required");
    }

    const item = await Content.findOneAndUpdate(
      { key },
      {
        value: req.body.value || "",
        page: req.body.page?.trim() || "General",
        label: req.body.label?.trim() || key,
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const deleteContent = async (req, res, next) => {
  try {
    const item = await Content.findByIdAndDelete(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error("Field not found");
    }
    res.json({ success: true, message: "Field deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getContentMap, getContentList, upsertContent, deleteContent };
