// Run with: npm run seed
// Creates the initial admin account (from .env) plus a few sample records.
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("../config/db");
const Admin = require("../models/Admin");
const Course = require("../models/Course");
const Project = require("../models/Project");
const Settings = require("../models/Settings");

const run = async () => {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || "admin@sritechembedded.com").toLowerCase();
  const existing = await Admin.findOne({ email });
  if (!existing) {
    await Admin.create({
      name: process.env.ADMIN_NAME || "Super Admin",
      email,
      password: process.env.ADMIN_PASSWORD || "ChangeMe123!",
    });
    console.log(`Admin created: ${email}`);
  } else {
    console.log("Admin already exists, skipping.");
  }

  const settingsCount = await Settings.countDocuments();
  if (settingsCount === 0) {
    await Settings.create({
      companyName: "SriTech Embedded Projects",
      tagline: "Bridging Theory and Industrial Innovation",
      about:
        "SriTech Embedded Projects focuses on Embedded Systems - specialized computing systems designed to perform dedicated functions within larger devices.",
      address: "Andhra Pradesh, India",
      phone: "+91 90000 00000",
      email: "info@sritechembedded.com",
      whatsapp: "+91 90000 00000",
    });
    console.log("Default settings created.");
  }

  const courseCount = await Course.countDocuments();
  if (courseCount === 0) {
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

  const projectCount = await Project.countDocuments();
  if (projectCount === 0) {
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

  console.log("Seeding complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
