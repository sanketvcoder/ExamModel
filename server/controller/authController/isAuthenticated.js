import userModel from "../../models/userModel.js";

export const isAuthenticated = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const user = await userModel.findById(userId).select(
      '-password -verifyOtp -resetOtp -verifyOtpExpireAt -resetOtpExpireAt -createdAt -updatedAt'
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Server error in /is-auth:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
