import express from 'express'
import { handleAdminSignin, handleAdminSignup } from '../controllers/adminAuth.js';

const router = express.Router();


router.post('/adminSignup', handleAdminSignup);
router.post('/adminSignin', handleAdminSignin);

export default router;