const bcrypt = require("bcrypt");
const authModel = require("../models/authModel");
const { generateToken } = require("../config/auth");

async function registerUser(req, res) {

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

  if (!full_name || !email || !password || !state || !country) {
    return res.status(400).json({
      message: "Missing required fields"
    });
  }

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

  authModel.createUser(values, (err) => {

    if (err) {

      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({
          message: "Email already exists"
        });
      }

      return res.status(500).json({
        message: "Database error"
      });
    }

    return res.status(201).json({
      message: "User registered successfully"
    });

  });

}


// LOGIN
async function loginUser(req, res) {

  const { email, password } = req.body;

  authModel.getUserByEmail(email, async (err, result) => {

    if (err) {
      return res.status(500).json({
        message: "Database error"
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password"
      });
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

}

module.exports = {
  registerUser,
  loginUser
};