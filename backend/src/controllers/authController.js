import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { setAuthCookie, signToken } from "../utils/token.js";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  created_at: user.createdAt,
});

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password)
      return res
        .status(400)
        .json({
          success: false,
          message: "Name, email and password are required",
        });
    if (password.length < 8 || password.length > 72)
      return res
        .status(400)
        .json({ success: false, message: "Password must be 8-72 characters" });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail }))
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12),
    });
    setAuthCookie(res, signToken(user._id.toString()));
    return res
      .status(201)
      .json({
        success: true,
        message: "Registration successful",
        user: publicUser(user),
      });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email?.trim().toLowerCase(),
    }).select("+passwordHash");
    if (!user || !(await bcrypt.compare(password || "", user.passwordHash)))
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    setAuthCookie(res, signToken(user._id.toString()));
    return res.json({
      success: true,
      message: "Login successful",
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
}

export function me(req, res) {
  return res.json({ success: true, user: publicUser(req.user) });
}
export function logout(req, res) {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
  return res.json({ success: true, message: "Logout successful" });
}
