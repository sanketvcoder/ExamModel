import { senderEmail } from "../../config/config.js";
import userModel from "../../models/userModel.js"; // added `.js` extension
import transporter from "../../config/nodemailer.js"; // make sure this is correctly exported

export const sendVerifyOtp = async (req, res) => {
    try {
        const userId  = req.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isAccountVerified) {
            return res.status(409).json({ // Conflict
                success: false,
                message: "Account already verified"
            });
        }

        // 6-digit OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // expires in 24 hrs
        await user.save();

        const mailOption = {
            from: senderEmail,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}. Verify your account using this OTP.`
        };

        await transporter.sendMail(mailOption);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
