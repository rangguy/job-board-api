// src/controllers/userController.js
const prisma = require("../helpers/db");
const bcrypt = require("bcryptjs");
const { signToken } = require('../helpers/jwt');

exports.register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password) {
      return res
        .status(422)
        .json({ success: false, message: "email & password wajib" });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "email sudah terdaftar" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const validRole = role === "EMPLOYER" ? "EMPLOYER" : "JOB_SEEKER";

    const user = await prisma.user.create({
      data: { email, password: hashed, name, role: validRole },
    });

    const { password: _, ...safe } = user;
    return res
      .status(201)
      .json({ success: true, message: "registered", data: safe });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "register failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res
        .status(422)
        .json({ success: false, message: "email & password wajib" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "email/password salah" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res
        .status(401)
        .json({ success: false, message: "email/password salah" });

    const token = signToken({
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    });

    const { password: _, ...safe } = user;
    return res.json({
      success: true,
      message: "login success",
      token,
      user: safe,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: "login failed" });
  }
};
