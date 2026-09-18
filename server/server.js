const express = require("express");
const http = require("http");
const cors = require("cors");

const { Server } = require("socket.io");

require("dotenv").config();

require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = require("./config/db");

const eventRoutes = require("./routes/eventRoutes");

const analyticsRoutes = require("./routes/analyticsRoutes");

const campaignRoutes = require("./routes/campaignRoutes");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

app.use(express.json());

app.set("io", io);

app.get("/", (req, res) => {
  res.json({
    message: "Social Proof Engine API is running",
  });
});

app.use("/api/events", eventRoutes);

app.use("/api/analytics", analyticsRoutes);
app.use("/api/campaigns", campaignRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // =====================================
  // JOIN SESSION ROOM
  // =====================================

  socket.on("join-session", (sessionId) => {
    if (!sessionId) {
      return;
    }

    socket.join(`session:${sessionId}`);

    console.log(`Socket ${socket.id} joined session:${sessionId}`);
  });

  // =====================================
  // JOIN LOCATION ROOM
  // =====================================

  socket.on("join-location", (location) => {
    if (!location) {
      return;
    }

    socket.join(`location:${location.toLowerCase()}`);

    console.log(`Socket ${socket.id} joined location:${location}`);
  });

  // =====================================
  // DISCONNECT
  // =====================================

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
