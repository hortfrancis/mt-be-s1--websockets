const express = require("express");
const cors = require("cors");
const conversationArray = require("./Services/PromptAI");
const multer = require("multer");

const fs = require("fs");
const path = require("path");

const logRoutes = require("./middleware/logger");
const bodyParser = require("body-parser");
const audioController = require("./controllers/controller");
const authController = require("./controllers/authController");

const speechFolderPath = path.resolve("./speechFile");

if (!fs.existsSync(speechFolderPath)) {
  fs.mkdirSync(speechFolderPath);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logRoutes);
app.use(bodyParser.raw({ type: "audio/*", limit: "10mb" }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.json({
    name: "Language app",
    description: "An app that utilizes AI to help teach languages",
  });
});

//login and register routes
app.post("/login", authController.login);
app.post("/register", authController.register);

// Route to receive user's recorded speech audio and sends back an ai response
app.post("/receive", upload.single("audio"), audioController.receive);

//conversation array from ai
app.get("/conversation", async (req, res) => {
  res.json(conversationArray);
});

(module.exports = app), speechFolderPath;
