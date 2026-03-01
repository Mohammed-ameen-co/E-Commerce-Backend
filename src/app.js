const cookieParser = require("cookie-parser");
const express = require("express");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to E-Commerce API");
});

const userRouter = require("./routes/user.routes");

app.use("/api/users", userRouter);

module.exports = app;
