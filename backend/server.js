require("dotenv").config();
const cors = require("cors");
const express = require("express");
const lifeRoute = require("./routers/life");
const authRoute = require("./routers/auth");
const usersRoute = require("./routers/users");

const app = express();

const PORT = process.env.PORT || 5555;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/life", lifeRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
