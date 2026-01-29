require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");

// 1. Database Connection & Schemas (From your server.js)
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri)
  .then(() => console.log("Connected to MongoDB via Manual Server!"))
  .catch((err) => console.error("Connection error:", err));

const Participant = mongoose.model(
  "Participant",
  new mongoose.Schema({
    name: String,
    email: String,
    event: String,
    dateSubmitted: String,
  })
);
const InCash = mongoose.model(
  "InCash",
  new mongoose.Schema({ screenshot: String, dateSubmitted: String })
);
const InKind = mongoose.model(
  "InKind",
  new mongoose.Schema({
    name: String,
    phone: String,
    date: String,
    choices: [String],
    dateSubmitted: String,
  })
);
const Contact = mongoose.model(
  "Contact",
  new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    dateSubmitted: String,
  })
);

// 2. Helper function to parse POST data (req.on('data') and req.on('end'))
const getRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject("Invalid JSON");
      }
    });
  });
};

// 3. Create the Server
const server = http.createServer(async (req, res) => {
  const { url, method } = req;

  // Manual CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // --- GET ROUTES (Reading from DB) ---
    if (method === "GET") {
      let data;
      if (url === "/participants") data = await Participant.find();
      else if (url === "/incash") data = await InCash.find();
      else if (url === "/inkind") data = await InKind.find();
      else if (url === "/contact") data = await Contact.find();

      if (data) {
        res.writeHead(200);
        return res.end(JSON.stringify(data));
      }
    }

    // --- POST ROUTES (Writing to DB) ---
    if (method === "POST") {
      const body = await getRequestBody(req);
      let newData;

      if (url === "/participants") newData = new Participant(body);
      else if (url === "/incash") newData = new InCash(body);
      else if (url === "/inkind") newData = new InKind(body);
      else if (url === "/contact") newData = new Contact(body);

      if (newData) {
        await newData.save();
        res.writeHead(201);
        return res.end(JSON.stringify(newData));
      }
    }

    // 404 Not Found
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Route not found" }));
  } catch (error) {
    console.error("Server Error:", error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Internal Server Error" }));
  }
});

server.listen(5000, () => console.log("Server running on port 5000"));
