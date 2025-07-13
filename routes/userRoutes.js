import express from 'express'
import {registerUser, loginUser, getProfile, updateProfile} from '../controllers/user.controller.js'
import upload from '../middleware/upload.js'


const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser);
router.get('/profile/:id', getProfile)
router.put('/profile/:id', upload.single('avatar'),updateProfile);

export default router;



