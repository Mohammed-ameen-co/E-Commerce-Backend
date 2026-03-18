const cookieParser = require("cookie-parser");
const express = require("express");

// const preUserSessionMiddleware = require("./middleware/eSession.middleware")

const app = express();

app.use(express.json());
app.use(cookieParser());

//pending...
// app.use(preUserSessionMiddleware);

app.get("/", (req, res) => {
  res.send("Welcome to E-Commerce API");
});

const userRouter = require("./routes/user.routes");
const emailVerifyRouter = require("./routes/emailverify.routes");
const adminRouter = require("./routes/admin.routes");
const categoryRouter = require("./routes/category.routes");
const invantoryRouter = require("./routes/inventory.routes");
const variantRouter = require("./routes/variant.routes");
const cartRouter = require("./routes/cart.routes");
const addressRouter = require("./routes/address.routes");
const ordersRouter = require("./routes/order.routes");

app.use("/api/e-users", userRouter);
app.use("/api/e-commerce", emailVerifyRouter);
app.use("/api/e-admin", adminRouter);
app.use("/api/e-category", categoryRouter);
app.use("/api/e-invantory", invantoryRouter);
app.use("/api/e-variant", variantRouter);
app.use("/api/e-cart", cartRouter);
app.use("/api/e-address", addressRouter);
app.use("/api/e-order", ordersRouter);

module.exports = app;
