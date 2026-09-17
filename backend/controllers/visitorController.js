const Visitor = require("../models/Visitor");

const getOrCreateCounter = async () => {
  let counter = await Visitor.findOne();
  if (!counter) counter = await Visitor.create({ count: 0 });
  return counter;
};

// @desc  Increment the visit counter by 1 and return the new total
// @route POST /api/visitors/track
const trackVisit = async (req, res, next) => {
  try {
    const counter = await getOrCreateCounter();
    counter.count += 1;
    await counter.save();
    res.json({ success: true, data: { count: counter.count } });
  } catch (err) {
    next(err);
  }
};

// @desc  Read the current count without incrementing (used by the admin dashboard)
// @route GET /api/visitors
const getCount = async (req, res, next) => {
  try {
    const counter = await getOrCreateCounter();
    res.json({ success: true, data: { count: counter.count } });
  } catch (err) {
    next(err);
  }
};

module.exports = { trackVisit, getCount };
