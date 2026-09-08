const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// Protect admin routes - verifies JWT and attaches admin to req
const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.admin = await Admin.findById(decoded.id).select("-password");
      if (!req.admin) {
        res.status(401);
        throw new Error("Not authorized, admin not found");
      }
      return next();
    } catch (error) {
      res.status(401);
      return next(new Error("Not authorized, token failed"));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, no token provided"));
  }
};

module.exports = { protect };
