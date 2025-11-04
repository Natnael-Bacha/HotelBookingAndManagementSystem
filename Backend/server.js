import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminAuthRouter from "../Backend/routes/adminAuth.js";
import { connectDB } from "./config/connectDB.js";
import roomsRouter from "../Backend/routes/rooms.js";

dotenv.config();
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://creative-cactus-3e49ca.netlify.app"],
    credentials: true,
  })
);
const port = process.env.PORT || 5002;

app.use("/adminAuth", adminAuthRouter);
app.use("/rooms", roomsRouter);


connectDB().then(() => {
  app.listen(port, () => {
    console.log("Server Started on Port:", port);
  });
});
