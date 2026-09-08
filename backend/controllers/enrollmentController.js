const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

const submitEnrollment = async (req, res, next) => {
  try {
    const { name, phone, email, courseId, message } = req.body;
    if (!name || !phone || !email || !courseId) {
      res.status(400);
      throw new Error("Name, phone, email and course are required");
    }
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }
    const enrollment = await Enrollment.create({
      name,
      phone,
      email,
      course: course._id,
      courseTitle: course.title,
      message,
    });
    res.status(201).json({ success: true, data: enrollment, message: "Enrollment submitted successfully" });
  } catch (err) {
    next(err);
  }
};

const getEnrollments = async (req, res, next) => {
  try {
    const { search, course, page = 1, limit = 15 } = req.query;
    const query = {};
    if (course) query.course = course;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { courseTitle: { $regex: search, $options: "i" } },
      ];
    }
    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 1);
    const [enrollments, total] = await Promise.all([
      Enrollment.find(query).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
      Enrollment.countDocuments(query),
    ]);
    res.json({ success: true, data: enrollments, pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!enrollment) {
      res.status(404);
      throw new Error("Enrollment not found");
    }
    res.json({ success: true, data: enrollment });
  } catch (err) {
    next(err);
  }
};

const deleteEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) {
      res.status(404);
      throw new Error("Enrollment not found");
    }
    res.json({ success: true, message: "Enrollment deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitEnrollment, getEnrollments, markAsRead, deleteEnrollment };
