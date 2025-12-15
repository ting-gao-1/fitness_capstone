import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  const { idToken } = req.body || {};
  if (!idToken) return res.status(400).json({ error: "idToken required" });

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const p = ticket.getPayload();

  const user = {
    sub: p.sub,
    email: p.email,
    name: p.name,
    picture: p.picture,
  };

  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// Playwright 用：只在 DEV_LOGIN_ENABLED=true 时开放
router.post("/dev-login", (req, res) => {
  if (process.env.DEV_LOGIN_ENABLED !== "true") {
    return res.status(404).json({ error: "Not enabled" });
  }
  const user = {
    sub: "dev-user-123",
    email: "dev@example.com",
    name: "Dev User",
    picture: "",
  };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user });
});

export default router;
