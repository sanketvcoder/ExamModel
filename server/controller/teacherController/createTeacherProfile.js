import teacherModel from '../../models/teacherModels.js';
import userModel from '../../models/userModel.js';

export const createTeacherProfile = async (req, res) => {
  const teacherId = req.userId;

  const {
    fullName,
    gender,
    dateOfBirth,
    phoneNumber,
    qualification,
    experience,
    specialization,
    bio,
    address,
    socialLinks
  } = req.body;

  try {
    // Check if user exists
    const user = await userModel.findById(teacherId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role !== 'teacher') {
      return res.status(403).json({ success: false, message: "Access denied: not a teacher" });
    }

    if (user.isProfileCreated) {
      return res.status(400).json({ success: false, message: "Profile already exists" });
    }

    // Basic validations
    if (
      !fullName || !gender || !dateOfBirth || !phoneNumber || !qualification ||
      !experience || !specialization
    ) {
      return res.status(400).json({ success: false, message: "Required fields are missing" });
    }

    if (typeof phoneNumber !== 'string' || phoneNumber.trim().length < 10) {
      return res.status(400).json({ success: false, message: "Invalid phone number" });
    }

    const existingContact = await teacherModel.findOne({ phoneNumber });
    if (existingContact) {
      return res.status(400).json({ success: false, message: "Phone number already in use" });
    }

    // Create profile
    const profile = await teacherModel.create({
      teacherId,
      fullName: fullName.trim(),
      gender,
      dateOfBirth,
      phoneNumber: phoneNumber.trim(),
      qualification: qualification.trim(),
      experience,
      specialization: specialization.trim(),
      bio: bio?.trim() || "",
      address: {
        street: address?.street || "",
        city: address?.city || "",
        state: address?.state || "",
        postalCode: address?.postalCode || ""
      },
      socialLinks: {
        linkedin: socialLinks?.linkedin || "",
        github: socialLinks?.github || ""
      }
    });

    // Mark user as profile created
    user.isProfileCreated = true;
    await user.save();

    const populatedProfile = await teacherModel.findById(profile._id).populate("teacherId", "name email");

    return res.status(201).json({ success: true, data: populatedProfile });

  } catch (error) {
    console.error("Error creating teacher profile:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
