const Domain = require("../models/Domain");
const Project = require("../models/Project");

const getDomains = async (req, res, next) => {
  try {
    const domains = await Domain.find().sort({ name: 1 });
    res.json({ success: true, data: domains });
  } catch (err) {
    next(err);
  }
};

const createDomain = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      res.status(400);
      throw new Error("Domain name is required");
    }
    const domain = await Domain.create({ name: name.trim() });
    res.status(201).json({ success: true, data: domain });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      return next(new Error("That domain already exists"));
    }
    next(err);
  }
};

const deleteDomain = async (req, res, next) => {
  try {
    const domain = await Domain.findById(req.params.id);
    if (!domain) {
      res.status(404);
      throw new Error("Domain not found");
    }
    const inUse = await Project.countDocuments({ domain: domain.name });
    if (inUse > 0) {
      res.status(400);
      throw new Error(`Can't delete - ${inUse} project(s) still use this domain. Reassign them first.`);
    }
    await domain.deleteOne();
    res.json({ success: true, message: "Domain deleted" });
  } catch (err) {
    next(err);
  }
};

const updateDomain = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      res.status(400);
      throw new Error("Domain name is required");
    }
    const domain = await Domain.findById(req.params.id);
    if (!domain) {
      res.status(404);
      throw new Error("Domain not found");
    }
    const newName = name.trim();
    if (domain.name !== newName) {
      const clash = await Domain.findOne({ name: newName });
      if (clash) {
        res.status(400);
        throw new Error("That domain name already exists");
      }
      const oldName = domain.name;
      domain.name = newName;
      await domain.save();
      await Project.updateMany({ domain: oldName }, { domain: newName });
    }
    res.json({ success: true, data: domain });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDomains, createDomain, updateDomain, deleteDomain };
