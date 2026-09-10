// Run with: npm run seed
// Creates the initial admin account (from .env) plus a few sample records.
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("../config/db");
const Admin = require("../models/Admin");
const Course = require("../models/Course");
const Project = require("../models/Project");
const Settings = require("../models/Settings");
const Content = require("../models/Content");
const Domain = require("../models/Domain");

const defaultDomains = [
  "8051 BASED PROJECTS",
  "PIC MICROCONTROLLER BASED PROJECTS",
  "ARDUINO BASED PROJECTS",
  "ESP32 BASED PROJECTS",
  "STM32 BASED PROJECTS",
  "RASPBEERY PI PICO BASED PROJECTS",
  "HARDWARE AND NETWORKING BASED PROJECTS",
  "LI-FI BASED PROJECTS",
  "ROBOTICS",
];

const run = async () => {
  await connectDB();

  const email = (process.env.ADMIN_EMAIL || "admin@sritechsolutions.com").toLowerCase();
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

  for (const name of defaultDomains) {
    await Domain.findOneAndUpdate({ name }, { name }, { upsert: true, setDefaultsOnInsert: true });
  }
  console.log("Default domains seeded.");

  const settingsCount = await Settings.countDocuments();
  if (settingsCount === 0) {
    await Settings.create({
      companyName: "Sritech Solutions",
      tagline: "Bridging Theory and Industrial Innovation",
      about:
        "Sritech Solutions focuses on Embedded Systems - specialized computing systems designed to perform dedicated functions within larger devices.",
      address: "Sritech Solutions, Ratnaveni Complex, Opp. Budhil Park Hotel, 1st Lane, Dwarakanagar, Visakhapatnam - 530016",
      phone: "99488-32456 / 86886-32456",
      email: "sritechsolutions9@gmail.com",
      whatsapp: "+91 99488-32456",
      social: { instagram: "https://instagram.com/sritech_projects" },
      stats: { studentsTrained: 500, projectsDelivered: 120, industryPartners: 15, branchesSupported: 8 },
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

  const defaultContent = [
    {
      key: "home.hero.badge",
      page: "Home",
      label: "Hero - Badge text",
      value: "Embedded Systems • Automation • Student Innovation",
    },
    {
      key: "home.hero.title",
      page: "Home",
      label: "Hero - Headline",
      value: "We engineer the dedicated systems inside tomorrow's devices.",
    },
    {
      key: "home.hero.subtitle",
      page: "Home",
      label: "Hero - Subtext",
      value:
        "SriTech Embedded Projects designs embedded hardware and software, builds industrial automation, and trains students from Diploma to M.Tech to take real projects from idea to working prototype.",
    },
    {
      key: "home.hero.cta_primary",
      page: "Home",
      label: "Hero - Primary button text",
      value: "Explore Projects",
    },
    {
      key: "home.hero.cta_secondary",
      page: "Home",
      label: "Hero - Secondary button text",
      value: "View Courses",
    },
    {
      key: "about.mission",
      page: "About",
      label: "Our Mission text",
      value:
        "To bridge the gap between theoretical learning and industrial applications through practical and innovative solutions - for students, and for the industries we partner with.",
    },
    {
      key: "about.vision",
      page: "About",
      label: "Our Vision text",
      value:
        "To be the trusted partner for embedded innovation in the region - where students build skills that transfer directly into industry, and where companies find dependable hardware and automation partners.",
    },
  ];

  for (const item of defaultContent) {
    await Content.findOneAndUpdate({ key: item.key }, item, {
      upsert: true,
      setDefaultsOnInsert: true,
    });
  }
  console.log("Default site content seeded.");

  console.log("Seeding complete.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
