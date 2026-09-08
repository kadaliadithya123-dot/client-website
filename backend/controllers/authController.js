const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");

// @desc  Login admin
// @route POST /api/auth/login
// @access Public
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin || !(await admin.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json({
      success: true,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      token: generateToken(admin._id),
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get logged-in admin profile
// @route GET /api/auth/me
// @access Private
const getProfile = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

// @desc  Change password
// @route PUT /api/auth/change-password
// @access Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (!(await admin.matchPassword(currentPassword))) {
      res.status(400);
      throw new Error("Current password is incorrect");
    }
    admin.password = newPassword;
    await admin.save();
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = { loginAdmin, getProfile, changePassword };
