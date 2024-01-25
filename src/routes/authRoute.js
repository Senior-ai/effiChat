import express from 'express';
import trimRequest from 'trim-request';
import { register, login, logout, refreshToken, changePassword } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/register').post(trimRequest.all,register);
router.route('/login').post(trimRequest.all,login);
router.route('/logout').post(trimRequest.all,logout);
router.route('/refreshtoken').post(trimRequest.all,refreshToken);
router.route('/changepassword').post(trimRequest.all,changePassword);

// router.route('/testingauthMiddleware').get(trimRequest.all, authMiddleware, (req, res) => {
//     res.send(req.user)
// });
export default router;