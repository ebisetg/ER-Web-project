require("dotenv").config(); // This is the magic line that reads the .env file
const express = require("express");
const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch((err) => console.error("Connection error:", err));
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" })); // Increased limit for Base64 images

// 1. Connect to MongoDB
// Replace the URL with your actual MongoDB Atlas string
// mongoose
//   .connect("mongodb://localhost:27017/er_project")
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log(err));

// 2. Define Schemas (Based on your db.json structure)
const ParticipantSchema = new mongoose.Schema({
  name: String,
  email: String,
  event: String,
  dateSubmitted: String,
});

const InCashSchema = new mongoose.Schema({
  screenshot: String, // Base64 string
  dateSubmitted: String,
});

const InKindSchema = new mongoose.Schema({
  name: String,
  phone: String,
  date: String,
  choices: [String],
  dateSubmitted: String,
});

// 3. Create Models
const Participant = mongoose.model("Participant", ParticipantSchema);
const InCash = mongoose.model("InCash", InCashSchema);
const InKind = mongoose.model("InKind", InKindSchema);

// 4. API Routes (Matching your existing frontend fetch calls)

// GET all data (for Admin Page)
app.get("/participants", async (req, res) =>
  res.json(await Participant.find())
);
app.get("/incash", async (req, res) => res.json(await InCash.find()));
app.get("/inkind", async (req, res) => res.json(await InKind.find()));

// POST data (from User Forms)
app.post("/participants", async (req, res) => {
  const newData = new Participant(req.body);
  await newData.save();
  res.status(201).json(newData);
});

app.post("/incash", async (req, res) => {
  const newData = new InCash(req.body);
  await newData.save();
  res.status(201).json(newData);
});

app.post("/inkind", async (req, res) => {
  const newData = new InKind(req.body);
  await newData.save();
  res.status(201).json(newData);
});

app.listen(5000, () => console.log("Server running on port 5000"));
