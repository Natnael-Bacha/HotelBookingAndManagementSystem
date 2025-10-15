import express from 'express'
import { createRoom, fetchRooms, verifyAdmin } from '../controllers/rooms.js';


const router = express.Router();

router.post('/createRoom',verifyAdmin, createRoom);
router.get('/fetchRooms', verifyAdmin, fetchRooms);



export default router;