require("dotenv").config();
const express = require('express');
const { generateToken } = require("./config/auth");
const { verifyToken, requireAdmin } = require("./config/auth");
const bcrypt = require('bcrypt');
const path = require('path');
const db = require('./connection');
const app = express();
const port = 3000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
app.get('/login', (req, res) => {
    res.sendFile((path.join(__dirname, 'public/html/login.html')))
});
app.get('/register', (req, res) => {
    res.sendFile((path.join(__dirname, 'public/html/register.html')))
})
//register user
app.post("/register/users", async (req, res) => {
    const {
        full_name,
        email,
        password,
        phone,
        address,
        state,
        country,
        gender,
        newsletter
    } = req.body;

    // validation
    if (!full_name || !email || !password || !state || !country) {
        return await res.status(400).json({
            message: "Missing required fields"
        });
    }

    const sql = `
        INSERT INTO users 
        (full_name, email, password, phone, address, state, country, gender, newsletter)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const hashedPassword = await bcrypt.hash(password, 10);
    const values = [
        full_name,
        email,
        hashedPassword,
        phone || null,
        address || null,
        state,
        country,
        gender || null,
        newsletter ? 1 : 0
    ];

    db.query(sql, values, async (err, result) => {
        if (err) {
            console.log(err);

            if (err.code === "ER_DUP_ENTRY") {
                return await res.status(409).json({
                    message: "Email already exists"
                });
            }

            return await res.status(500).json({
                message: "Database error"
            });
        }

        return await res.status(201).json({
            message: "User registered successfully"
        });
    });
});

//login user
app.post("/loginUser", (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {

        if (err) return res.status(500).json({ message: "Database error" });

        if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }
        const token = generateToken(user);
        
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                role: user.role
            }
        });
    });
});
// ===================== ADMIN - ADD PRODUCT =====================

app.post("/admin/products", verifyToken, requireAdmin, (req, res) =>{

    const {
        name,
        price,
        image_url,
        category,
        description,
        stock
    } = req.body;

    if (!name || !price) {
        return res.status(400).json({
            message: "Missing required fields"
        });
    }

    const sql = `
        INSERT INTO products
        (name, price, image_url, category, description, stock)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        name,
        price,
        image_url,
        category || null,
        description || null,
        stock || 0
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        return res.status(201).json({
            message: "Product added successfully"
        });

    });
});


// ===================== GET ALL PRODUCTS =====================
app.get("/products", (req, res) => {

    const sql = "SELECT * FROM products ORDER BY id DESC";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database error"
            });
        }

        res.status(200).json(result);
    });
});
//--------------------------------USER INTERACTION ---------------------
//add to cart
app.post("/cart/add", (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  const sql = `
    INSERT INTO cart (user_id, product_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
    quantity = quantity + VALUES(quantity)
  `;

  db.query(sql, [user_id, product_id, quantity || 1], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json({ message: "Added to cart" });
  });
});
//get cart items
app.get("/cart/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      cart.id,
      cart.quantity,
      products.name,
      products.price,
      products.image_url
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "DB error" });
    }

    res.json(result);
  });
});

//get user cart quantity
app.get("/cart/count/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT SUM(quantity) AS total
    FROM cart
    WHERE user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "DB error" });
    }

    res.json({ total: result[0].total || 0 });
  });
});

// LISTEN (OUTSIDE ROUTES)
app.listen(port, () => {
    console.log('Connected on port:3000');
});