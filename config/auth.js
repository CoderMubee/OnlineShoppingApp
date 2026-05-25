//HANDLE TOKEN AUTHENTICATION 
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

// create token
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    SECRET,
    { expiresIn: "2h" }
  );
}

// verify token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

// admin only
function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  requireAdmin
};