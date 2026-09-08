const Project = require("../models/Project");

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// @desc  Get all projects (public: published only, filter by domain, search, pagination)
// @route GET /api/projects
const getProjects = async (req, res, next) => {
  try {
    const { search, domain, page = 1, limit = 9, admin } = req.query;
    const query = {};
    if (!admin) query.isPublished = true;
    if (domain) query.domain = domain;
    if (search) query.$text = { $search: search };

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 1);

    const [projects, total] = await Promise.all([
      Project.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Project.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: projects,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single project by slug
// @route GET /api/projects/:slug
const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// @desc  Create project (thumbnail + up to 8 gallery images + optional pdf)
// @route POST /api/projects
// @access Private
const createProject = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (typeof body.technologies === "string") body.technologies = body.technologies.split(",").map((t) => t.trim());
    body.slug = slugify(body.title || "");

    if (req.files?.thumbnail?.[0]) body.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
    if (req.files?.images?.length) body.images = req.files.images.map((f) => `/uploads/${f.filename}`);
    if (req.files?.pdf?.[0]) body.pdfUrl = `/uploads/${req.files.pdf[0].filename}`;

    const project = await Project.create(body);
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// @desc  Update project
// @route PUT /api/projects/:id
// @access Private
const updateProject = async (req, res, next) => {
  try {
    const existing = await Project.findById(req.params.id);
    if (!existing) {
      res.status(404);
      throw new Error("Project not found");
    }

    const body = { ...req.body };
    if (typeof body.technologies === "string") body.technologies = body.technologies.split(",").map((t) => t.trim());
    if (body.title) body.slug = slugify(body.title);

    if (req.files?.thumbnail?.[0]) {
      body.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
    } else if (body.removeThumbnail === "true") {
      body.thumbnail = "";
    }

    if (req.files?.pdf?.[0]) {
      body.pdfUrl = `/uploads/${req.files.pdf[0].filename}`;
    } else if (body.removePdf === "true") {
      body.pdfUrl = "";
    }

    let images = existing.images || [];
    if (body.imagesToRemove) {
      const toRemove = body.imagesToRemove.split(",").map((s) => s.trim()).filter(Boolean);
      images = images.filter((img) => !toRemove.includes(img));
    }
    if (req.files?.images?.length) {
      images = [...images, ...req.files.images.map((f) => `/uploads/${f.filename}`)];
    }
    body.images = images;

    delete body.removeThumbnail;
    delete body.removePdf;
    delete body.imagesToRemove;

    const project = await Project.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete project
// @route DELETE /api/projects/:id
// @access Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }
    res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProjects, getProjectBySlug, createProject, updateProject, deleteProject };
