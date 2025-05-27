import userModel from "../../models/userModel.js";

export const verifyEmail = async (req, res) => {
    const userId = req.userId
    const { otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({
            success: false,
            message: "Missing details: userId or OTP"
        });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.verifyOtp || user.verifyOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(410).json({ // 410 Gone is appropriate for expired resource
                success: false,
                message: "OTP expired"
            });
        }

        // Mark user as verified and clear OTP
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User verified successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
};
