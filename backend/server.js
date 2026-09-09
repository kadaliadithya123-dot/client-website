const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const projectRoutes = require("./routes/projectRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const contactRoutes = require("./routes/contactRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const Admin = require("./models/Admin");
const Course = require("./models/Course");
const Project = require("./models/Project");
const Settings = require("./models/Settings");

const seedDefaultData = async () => {
  const email = (process.env.ADMIN_EMAIL || "admin@sritechembedded.com").toLowerCase();

  const existingAdmin = await Admin.findOne({ email });
  if (!existingAdmin) {
    await Admin.create({
      name: process.env.ADMIN_NAME || "Super Admin",
      email,
      password: process.env.ADMIN_PASSWORD || "ChangeMe123!",
    });
    console.log(`Admin created: ${email}`);
  }

  if ((await Settings.countDocuments()) === 0) {
    await Settings.create({
      companyName: "Sritech Solutions",
      tagline: "Bridging Theory and Industrial Innovation",
      about:
        "Sritech Solutions focuses on Embedded Systems - specialized computing systems designed to perform dedicated functions within larger devices.",
      address: "Sritech Solutions, Ratnaveni Complex, 1st Lane, Dwarakanagar, Visakhapatnam - 530016",
      phone: "99488-32456 / 86886-32456",
      email: "sritechsolutions9@gmail.com",
      whatsapp: "+91 99488-32456",
      social: { instagram: "https://instagram.com/sritech_projects" },
      stats: { studentsTrained: 500, projectsDelivered: 120, industryPartners: 15, branchesSupported: 8 },
    });
    console.log("Default settings created.");
  }

  if ((await Course.countDocuments()) === 0) {
    await Course.create([
      {
        title: "Embedded Systems with ARM Cortex-M",
        slug: "embedded-systems-arm-cortex-m",
        description: "Hands-on training on ARM Cortex-M microcontrollers, peripherals and RTOS basics.",
        duration: "6 Weeks",
        fee: 6999,
        level: "Intermediate",
        trainer: "SriTech Faculty",
        technologies: ["C", "ARM Cortex-M", "RTOS", "Embedded C"],
        syllabus: ["Microcontroller Architecture", "GPIO & Timers", "UART/SPI/I2C", "RTOS Fundamentals"],
        eligibility: "B.Tech / Diploma - ECE, EEE, CSE",
      },
      {
        title: "IoT Product Development",
        slug: "iot-product-development",
        description: "Build end-to-end IoT products from sensor to cloud dashboard.",
        duration: "8 Weeks",
        fee: 8999,
        level: "Intermediate",
        trainer: "SriTech Faculty",
        technologies: ["ESP32", "MQTT", "Node.js", "Cloud Dashboards"],
        syllabus: ["Sensor Interfacing", "Wireless Protocols", "Cloud Integration", "Dashboard & Alerts"],
        eligibility: "Diploma / B.Tech - Any branch with basic electronics",
      },
    ]);
    console.log("Sample courses created.");
  }

  if ((await Project.countDocuments()) === 0) {
    await Project.create([
      {
        title: "Smart Health Monitoring Wearable",
        slug: "smart-health-monitoring-wearable",
        description: "A biomedical wearable that tracks heart rate, SpO2 and temperature with cloud logging.",
        domain: "ESP32 BASED PROJECTS",
        technologies: ["ESP32", "MAX30100", "Firebase"],
        difficulty: "Advanced",
        teamSize: 3,
      },
      {
        title: "Autonomous Line-Following Robot",
        slug: "autonomous-line-following-robot",
        description: "An IR-sensor based robot with PID control for smooth line following.",
        domain: "ROBOTICS",
        technologies: ["Arduino", "IR Sensors", "PID Control"],
        difficulty: "Beginner",
        teamSize: 2,
      },
    ]);
    console.log("Sample projects created.");
  }
};

const app = express();

// Allow one or more comma-separated origins
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/enrollments", enrollmentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(seedDefaultData)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Startup error:", error.message);
    process.exit(1);
  });
