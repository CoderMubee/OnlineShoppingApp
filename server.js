require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Pages
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public/html/register.html"));
});

// Route Files
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/", authRoutes);

app.use("/products", productRoutes);

app.use("/admin", adminRoutes);

app.use("/cart", cartRoutes);

app.use("/orders", orderRoutes);

// Listen
app.listen(port, () => {
  console.log("Connected on port:3000");
});