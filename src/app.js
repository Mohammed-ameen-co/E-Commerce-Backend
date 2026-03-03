const cookieParser = require("cookie-parser");
const express = require("express");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Welcome to E-Commerce API");
});

const userRouter = require("./routes/user.routes");
const emailVerifyRouter = require("./routes/emailverify.routes");
const adminRouter = require("./routes/admin.routes");
const categoryRouter = require("./routes/category.routes")
const invantoryRouter = require("./routes/inventory.routes")

app.use("/api/users", userRouter);
app.use("/api/e-commerce", emailVerifyRouter);
app.use("/api/admin", adminRouter);
app.use("/api/e-commerce",categoryRouter);
app.use("/api/e-commerce",invantoryRouter);

module.exports = app;
