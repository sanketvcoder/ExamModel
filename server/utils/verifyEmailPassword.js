import bcrypt from 'bcryptjs'
import userModel from "../models/userModel.js";

export const verifiedUsers = new Set();

export const verifyEmailPassword = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //Compare hashed password

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    verifiedUsers.add(user._id.toString())
    console.log(verifiedUsers)
    req.user = user;
    
    return res.status(200).json({
      success: true,
      message: "User verified successfully",
    });
    
  } catch (error) {
    console.error("Error verifying email and password:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export default verifiedUsers;