import express from "express";
import Event from "../models/event.js";

const router = express.Router();

router.post("/events", async (req, res) => {
  try {
    const { session_id, eventType, url, timestamp, x, y, viewport_width, viewport_height } = req.body;
    const event = await Event.create({
      session_id,
      eventType,
      url,
      timestamp,
      x,
      y,
      viewport_width,
      viewport_height,
    });
    res.status(201).json({ message: "Event stored successfully", event });
  }catch(err){
    res.status(400).json({ error: err.message});
  }
});

router.get("/sessions",async (req,res)=>{
  try {
    const sessions = await Event.aggregate([
      {$match: { session_id: { $ne: null } }},
      {
        $group: {
          _id: "$session_id",
          total_events: { $sum: 1 },
          first_event: { $min: "$timestamp" },
          last_event: { $max: "$timestamp" },
        },
      },
      { $sort: { last_event: -1 } },
    ]);

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/sessions/:id/events", async (req, res) => {
  try {
    const events = await Event.find({ session_id: req.params.id }).sort({
      timestamp: 1,
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/heatmap", async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: "url is required" });
    }

    const clicks = await Event.find({ eventType: "click", url }).select(
      "x y viewport_w viewport_h -_id"
    );

    res.json(clicks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/pages", async (req, res) => {
  try{
    const pages = await Event.distinct("url");
    res.json(pages);
  }
  catch(err){
    res.status(500).json({ error: err.message });
  }
});

export default router;