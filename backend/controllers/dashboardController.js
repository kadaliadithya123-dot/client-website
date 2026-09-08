const Course = require("../models/Course");
const Project = require("../models/Project");
const Gallery = require("../models/Gallery");
const Contact = require("../models/Contact");

// @desc  Aggregate dashboard stats
// @route GET /api/dashboard/stats
// @access Private
const getStats = async (req, res, next) => {
  try {
    const [totalCourses, totalProjects, totalGalleryImages, totalMessages, unreadMessages] = await Promise.all([
      Course.countDocuments(),
      Project.countDocuments(),
      Gallery.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
    ]);

    res.json({
      success: true,
      data: { totalCourses, totalProjects, totalGalleryImages, totalMessages, unreadMessages },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
