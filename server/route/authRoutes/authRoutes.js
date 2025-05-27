import express from 'express'
import { register } from '../../controller/authController/register.js'
import { login } from '../../controller/authController/login.js';
import { logout } from '../../controller/authController/logout.js';
import userAuth from '../../middleware/userAuth.js';
import { sendVerifyOtp } from '../../controller/authController/sendVerifyOtp.js';
import { verifyEmail } from '../../controller/authController/verifyEmail.js';
import { isAuthenticated } from '../../controller/authController/isAuthenticated.js';
import { sendResetOtp } from '../../controller/authController/sendResetOtp.js';
import { resetPassword } from '../../controller/authController/resetUserPass.js';
const authRouter = express.Router()

authRouter.post('/register',register);
authRouter.post('/login',login)
authRouter.post('/logout',logout)
authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp)
authRouter.post('/verify-account',userAuth,verifyEmail)
authRouter.post('/is-auth',userAuth,isAuthenticated)
authRouter.post('/send-reset-otp',sendResetOtp)
authRouter.post('/reset-password',resetPassword)



export default authRouter