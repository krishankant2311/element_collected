require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const { createDefaultAdmin } = require("./module/models/adminModel");
const { seedDummyFaqs } = require("./module/models/faqModel");
const { seedDummyTerms } = require("./module/models/termsModel");
const adminRoutes = require("./module/routes/adminRoutes");
const userRoutes = require("./module/routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

connectDB().then(async () => {
  await createDefaultAdmin();
  await seedDummyFaqs();
  await seedDummyTerms();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});