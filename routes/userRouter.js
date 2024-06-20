import express from 'express';
import * as userControll from '../controllers/userController.js';
const router = express.Router();

router.post('/signup',userControll._Signup );
router.post('/login',userControll._Login );
router.post('/addmusic',userControll._addMusic)

export default router;