import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import eventRoutes from "./routes/events.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", eventRoutes);

app.get('/',(req,res)=>{
  res.send('Analytics server is running');
});

app.get('/tracker.js',(req,res)=>{
  res.sendFile('tracker.js',{root: process.cwd()});
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT,()=>
  console.log(`Server is running on port ${PORT}`));
})
.catch((err)=>
console.log("MongoDB connection error:", err));
