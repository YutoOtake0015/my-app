require("dotenv").config();
const express = require("express");
const app = express();

const PORT = process.env.PORT || 5555;

app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "test data" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
