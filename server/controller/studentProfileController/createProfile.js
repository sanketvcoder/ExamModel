import studentProfileModel from "../../models/studentProfileModels.js";
import userModel from "../../models/userModel.js";

export const createProfile = async (req, res) => {
  const userId = req.userId;

  // ✅ Destructure all fields directly
  const {
    contact,
    section,
    dateOfBirth,
    qualification,
    yearOfStudy,
    specialization,
    bio,
    street,
    city,
    state,
    postalCode,
    linkedin,
    github,
  } = req.body;

  try {
    console.log("Received userId:", userId);
    console.log("Received body:", JSON.stringify(req.body, null, 2));

    // ✅ Input validations
    if (!contact || typeof contact !== 'string' || contact.trim().length < 10) {
      return res.status(400).json({ success: false, message: "Invalid or missing contact" });
    }

    if (!section || typeof section !== 'string' || section.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Section is required" });
    }

    if (!dateOfBirth || isNaN(new Date(dateOfBirth))) {
      return res.status(400).json({ success: false, message: "Invalid or missing date of birth" });
    }

    if (!qualification || typeof qualification !== 'string' || qualification.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Qualification is required" });
    }

    if (!yearOfStudy || typeof yearOfStudy !== 'string' || yearOfStudy.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Year of study is required" });
    }

    if (!specialization || typeof specialization !== 'string' || specialization.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Specialization is required" });
    }

    if (!bio || typeof bio !== 'string' || bio.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Bio is required" });
    }

    if (!street || !city || !state || !postalCode) {
      return res.status(400).json({ success: false, message: "Address fields are incomplete or missing" });
    }

    if (!linkedin || !github) {
      return res.status(400).json({ success: false, message: "LinkedIn and GitHub links are required" });
    }

    // ✅ Check user exists
    const user = await userModel.findById(userId).select('name email isProfileCreated');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isProfileCreated) {
      return res.status(400).json({ success: false, message: "Profile already exists" });
    }

    // ✅ Check for duplicate contact
    const existingProfile = await studentProfileModel.findOne({ contact });
    if (existingProfile) {
      return res.status(400).json({ success: false, message: "Profile with this contact already exists" });
    }

    // ✅ Create the new profile
    const profile = await studentProfileModel.create({
      userId,
      contact: contact.trim(),
      section: section.trim(),
      dateOfBirth: new Date(dateOfBirth),
      qualification: qualification.trim(),
      yearOfStudy: yearOfStudy.trim(),
      specialization: specialization.trim(),
      bio: bio.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      linkedin: linkedin.trim(),
      github: github.trim(),
    });

    // ✅ Update user's profile status
    user.isProfileCreated = true;
    await user.save();

    // ✅ Return populated profile with user data
    const populatedProfile = await studentProfileModel.findById(profile._id).populate('userId', 'name email');

    return res.status(201).json({ success: true, data: populatedProfile });

  } catch (error) {
    console.error("Error in createProfile:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
