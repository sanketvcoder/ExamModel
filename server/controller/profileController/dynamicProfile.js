import userModel from "../../models/userModel.js";
import { createProfile } from "../studentProfileController/createProfile.js";
import { getProfile as getStudentProfile } from "../studentProfileController/getProfile.js";
import { updateProfile as updateStudentProfile } from "../studentProfileController/updateProfile.js";

import { createTeacherProfile } from "../teacherController/createTeacherProfile.js";
import { getTeacherProfile } from "../teacherController/getTeacherProfile.js";
import { updateTeacherProfile } from "../teacherController/updateTeacherProfile.js";

// Create Profile Based on Role
export const dynamicProfile = async (req, res) => {
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is missing" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === 'teacher') {
      return createTeacherProfile(req, res);
    } else if (user.role === 'student') {
      return createProfile(req, res);
    } else {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
  } catch (error) {
    console.error("Error in dynamic profile creation:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Profile Based on Role
export const getDynamicProfile = async (req, res) => {
  const userId = req.userId;
  console.log("this is getDynamic",userId);
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === 'teacher') {
      return getTeacherProfile(req, res);
    } else if (user.role === 'student') {
      return getStudentProfile(req, res);
    } else {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
  } catch (error) {
    console.error("Error in dynamic profile fetch:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Profile Based on Role
export const updateDynamicProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === 'teacher') {
      return updateTeacherProfile(req, res);
    } else if (user.role === 'student') {
      return updateStudentProfile(req, res);
    } else {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
  } catch (error) {
    console.error("Error in dynamic profile update:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
