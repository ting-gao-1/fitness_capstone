import express from "express";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/quote", requireAuth, async (req, res) => {
  const r = await fetch("https://zenquotes.io/api/random");
  if (!r.ok) return res.status(502).json({ error: "External API failed" });

  const arr = await r.json(); // [{ q, a, h }]
  const item = arr?.[0];
  res.json({ quote: item?.q || "", author: item?.a || "" });
});

export default router;
