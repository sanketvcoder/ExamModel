import { senderEmail } from "../../config/config.js";
import transporter from "../../config/nodemailer.js";
import userModel from "../../models/userModel.js";
export const sendResetOtp = async(req,res)=>{
    const {email} = req.body
    if(!email){
        return res.json({
            success:false,
            message:'Email is required'
        })
    }

    try {
        const user  = await userModel.findOne({email})

        if(!user){
            return res.status(401).json({
                success: false,
                message: 'user not found'
            })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp
        user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        const mailOption = {
            from:senderEmail,
            to:user.email,
            subject:"Password Reset OTP",
            text:`Your OTP tpreseting your password is ${otp}. use this OTP to proceed with resetting your password.`
        }
        await transporter.sendMail(mailOption)

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}