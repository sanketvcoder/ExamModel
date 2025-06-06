import studentProfileModel from "../../models/studentProfileModels.js";
import userModel from "../../models/userModel.js";

export const updateProfile = async (req, res) => {
  const userId = req.userId;
  const { name, contact } = req.body;

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) {
      user.name = name;
      await user.save();
    }

    if (contact) {
      const profile = await studentProfileModel.findOne({ userId });

      if (!profile) {
        return res.status(404).json({ success: false, message: "Profile not found" });
      }

      profile.contact = contact;
      await profile.save();
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });

  } catch (error) {
    console.error("Error updating profile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
      error: `the error is ${error}`
    });
  }
};
