import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  session_id: { type: String, required: true },
  eventType:{ type: String, required: true, enum: ['click','page_view'] },
  url:{ type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  x: Number,
  y: Number,
  viewport_width: Number,
  viewport_height: Number,
});

eventSchema.index({ session_id: 1, timestamp: 1 });
eventSchema.index({ url: 1, eventType: 1});

export default mongoose.model("Event", eventSchema);
