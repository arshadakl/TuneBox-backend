import express from 'express';
import * as userControll from '../controllers/userController.js';
const router = express.Router();

router.post('/signup',userControll._Signup );
router.post('/login',userControll._Login );

export default router;