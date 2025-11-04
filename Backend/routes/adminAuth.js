import express from 'express'
import { handleAdminSignin, handleAdminSignup, handleLogout } from '../controllers/adminAuth.js';

const router = express.Router();


router.post('/adminSignup', handleAdminSignup);
router.post('/adminSignin', handleAdminSignin);
router.post('/logout', handleLogout);
export default router;