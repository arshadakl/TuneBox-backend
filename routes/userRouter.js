import express from 'express';
import * as userControll from '../controllers/userController.js';
import { Auth } from '../middlewares/Auth.js';
const router = express.Router();

router.post('/signup',userControll._Signup );
router.post('/login',userControll._Login );
router.post('/addmusic',Auth,userControll._addMusic)
router.post('/logout',Auth,userControll._logout)
router.get('/getplaylist',Auth,userControll._userPlaylist)

export default router;