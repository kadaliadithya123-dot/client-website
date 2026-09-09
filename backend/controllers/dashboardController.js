const Course = require("../models/Course");
const Project = require("../models/Project");
const Gallery = require("../models/Gallery");
const Contact = require("../models/Contact");
const Enrollment = require("../models/Enrollment");

// @desc  Aggregate dashboard stats
// @route GET /api/dashboard/stats
// @access Private
const getStats = async (req, res, next) => {
  try {
    const [totalCourses, totalProjects, totalGalleryImages, totalMessages, unreadMessages, totalEnrollments] = await Promise.all([
      Course.countDocuments(),
      Project.countDocuments(),
      Gallery.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Enrollment.countDocuments(),
    ]);

    res.json({
      success: true,
      data: { totalCourses, totalProjects, totalGalleryImages, totalMessages, unreadMessages, totalEnrollments },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
