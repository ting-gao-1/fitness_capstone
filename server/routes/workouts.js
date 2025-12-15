
import express from "express";
import { z } from "zod";
import Workout from "../models/Workout.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const workoutSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  type: z.string().min(1).max(30),
  durationMin: z.number().int().min(1).max(600),
  notes: z.string().max(300).optional().default(""),
});

// GET /api/workouts  (list mine)
router.get("/", requireAuth, async (req, res) => {
  const workouts = await Workout.find({ userId: req.user.sub }).sort({ date: -1, createdAt: -1 });
  res.json({ workouts });
});

// POST /api/workouts (create)
router.post("/", requireAuth, async (req, res) => {
  const parsed = workoutSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const workout = await Workout.create({ ...parsed.data, userId: req.user.sub });
  res.status(201).json({ workout });
});

// PUT /api/workouts/:id (update)
router.put("/:id", requireAuth, async (req, res) => {
  const parsed = workoutSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const workout = await Workout.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.sub },
    parsed.data,
    { new: true }
  );

  if (!workout) return res.status(404).json({ error: "Workout not found" });
  res.json({ workout });
});

// DELETE /api/workouts/:id (delete)
router.delete("/:id", requireAuth, async (req, res) => {
  const workout = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.user.sub });
  if (!workout) return res.status(404).json({ error: "Workout not found" });
  res.json({ ok: true });
});

export default router;
