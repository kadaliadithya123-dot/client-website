const Course = require("../models/Course");

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// @desc  Get all courses (public: only published, supports search/filter/pagination)
// @route GET /api/courses
const getCourses = async (req, res, next) => {
  try {
    const { search, level, page = 1, limit = 9, admin } = req.query;
    const query = {};
    if (!admin) query.isPublished = true;
    if (level) query.level = level;
    if (search) query.$text = { $search: search };

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 1);

    const [courses, total] = await Promise.all([
      Course.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Course.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: courses,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single course by slug
// @route GET /api/courses/:slug
const getCourseBySlug = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }
    res.json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

// @desc  Create course
// @route POST /api/courses
// @access Private
const createCourse = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (typeof body.technologies === "string") body.technologies = body.technologies.split(",").map((t) => t.trim());
    if (typeof body.syllabus === "string") body.syllabus = body.syllabus.split("\n").map((s) => s.trim()).filter(Boolean);
    if (req.file) body.image = req.file.path;
    body.slug = slugify(body.title || "");

    const course = await Course.create(body);
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

// @desc  Update course
// @route PUT /api/courses/:id
// @access Private
const updateCourse = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (typeof body.technologies === "string") body.technologies = body.technologies.split(",").map((t) => t.trim());
    if (typeof body.syllabus === "string") body.syllabus = body.syllabus.split("\n").map((s) => s.trim()).filter(Boolean);
    if (req.file) {
      body.image = req.file.path;
    } else if (body.removeImage === "true") {
      body.image = "";
    }
    delete body.removeImage;
    if (body.title) body.slug = slugify(body.title);

    const course = await Course.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }
    res.json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete course
// @route DELETE /api/courses/:id
// @access Private
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }
    res.json({ success: true, message: "Course deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCourses, getCourseBySlug, createCourse, updateCourse, deleteCourse };
