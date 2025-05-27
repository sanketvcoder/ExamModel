import teacherModel from "../../models/teacherModels.js";

export const updateTeacherProfile = async (req, res) => {
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
    const profile = await teacherModel.findOne({ teacherId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found",
      });
    }

    // Update basic fields
    if (fullName) profile.fullName = fullName.trim();
    if (gender) profile.gender = gender;
    if (dateOfBirth) profile.dateOfBirth = dateOfBirth;
    if (phoneNumber) profile.phoneNumber = phoneNumber.trim();
    if (qualification) profile.qualification = qualification.trim();
    if (experience !== undefined) profile.experience = experience;
    if (specialization) profile.specialization = specialization.trim();
    if (bio) profile.bio = bio.trim();

    // Update address
    if (address) {
      profile.address = {
        ...profile.address,
        ...address
      };
    }

    // Update social links
    if (socialLinks) {
      profile.socialLinks = {
        ...profile.socialLinks,
        ...socialLinks
      };
    }

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });

  } catch (error) {
    console.error("Error updating teacher profile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
