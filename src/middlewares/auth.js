// src/middlewares/auth.js
const { verifyToken } = require("../helpers/jwt");

function authenticate(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const [, token] = auth.split(" "); // "Bearer <token>"
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = verifyToken(token);
    // simpan user ke request untuk dipakai di controller
    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch (e) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: insufficient role" });
    }
    next();
  };
}

module.exports = { authenticate, requireRole };
