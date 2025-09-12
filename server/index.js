import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";


dotenv.config();
const app=express();
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended: false}));
app.use(cors({
    origin: true,
    credentials:true
}));
const PORT=process.env.PORT || 6001;


import assessmentRoutes from "./routes/assessment.routes.js";
import roadmapRoutes from "./routes/roadmap.routes.js"; 
import authRoutes from "./routes/auth.routes.js";
import contentRoutes from "./routes/content.routes.js";

//API
app.use("/api/assessment",assessmentRoutes);
app.use("/api/roadmap",roadmapRoutes);
app.use("/api/content",contentRoutes);
app.use("/api/auth",authRoutes);


app.get('/',(req,res)=>{
    res.send("hey there!..How you doin...");
})

mongoose.connect(process.env.MONGO_URL, {
})
.then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});