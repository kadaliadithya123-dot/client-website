const Contact = require("../models/Contact");

// @desc  Submit contact form
// @route POST /api/contact
const submitContact = async (req, res, next) => {
  try {
    const { name, phone, email, subject, message } = req.body;
    if (!name || !phone || !email || !subject || !message) {
      res.status(400);
      throw new Error("All fields are required");
    }
    const contact = await Contact.create({ name, phone, email, subject, message });
    res.status(201).json({ success: true, data: contact, message: "Message sent successfully" });
  } catch (err) {
    next(err);
  }
};

// @desc  Get all messages (admin)
// @route GET /api/contact
// @access Private
const getContacts = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 15 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }
    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 1);

    const [messages, total] = await Promise.all([
      Contact.find(query).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
      Contact.countDocuments(query),
    ]);

    res.json({ success: true, data: messages, pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) } });
  } catch (err) {
    next(err);
  }
};

// @desc  Mark message as read
// @route PUT /api/contact/:id/read
// @access Private
const markAsRead = async (req, res, next) => {
  try {
    const msg = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!msg) {
      res.status(404);
      throw new Error("Message not found");
    }
    res.json({ success: true, data: msg });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete message
// @route DELETE /api/contact/:id
// @access Private
const deleteContact = async (req, res, next) => {
  try {
    const msg = await Contact.findByIdAndDelete(req.params.id);
    if (!msg) {
      res.status(404);
      throw new Error("Message not found");
    }
    res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitContact, getContacts, markAsRead, deleteContact };
