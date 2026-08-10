const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const planetRoutes = require("./routes/planetRoutes");
const migrationRoutes = require("./routes/migrationRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const itemRoutes = require("./routes/itemRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/planets", planetRoutes);
app.use("/api/migrate", migrationRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/items", itemRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "aura-app",
  });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `AURA-APP API running on port ${PORT}`
  );
});
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

startServer();