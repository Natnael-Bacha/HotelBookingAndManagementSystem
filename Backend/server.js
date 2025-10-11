import express from 'express'
import { connectDB } from './config/connectDB.js';
import dotenv from 'dotenv'
import adminAuthRouter from '../Backend/routes/adminAuth.js'
import cors from 'cors';
dotenv.config();
const app = express();
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}))
const port = process.env.PORT || 5002

app.use('/adminAuth',adminAuthRouter )
connectDB().then(()=>{
    app.listen(port, ()=>{
        console.log("Server Started on Port:", port)
    })
}) 