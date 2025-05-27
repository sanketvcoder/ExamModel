import studentProfileModel from "../../models/sutidentProfileModels.js";
import userModel from "../../models/userModel.js";

export const createProfile = async (req, res) => {
    const userId = req.userId;
    const { contact, section, dateOfBirth, qualification, yearOfStudy, specialization, bio, address, socialLinks } = req.body;

    try {
        // Input validation
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
        if (!address || typeof address !== 'object' || !address.street || !address.city || !address.state || !address.postalCode) {
            return res.status(400).json({ success: false, message: "Address is incomplete or invalid" });
        }
        if (!socialLinks || typeof socialLinks !== 'object' || !socialLinks.linkedin || !socialLinks.github) {
            return res.status(400).json({ success: false, message: "Social links (LinkedIn and GitHub) are required" });
        }

        const user = await userModel.findById(userId).select('name email isProfileCreated');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isProfileCreated) {
            return res.status(400).json({ success: false, message: "Profile already exists" });
        }

        const existingProfile = await studentProfileModel.findOne({ contact });
        if (existingProfile) {
            return res.status(400).json({ success: false, message: "Profile with this contact already exists" });
        }

        // Create the new student profile
        const profile = await studentProfileModel.create({
            userId,
            contact: contact.trim(),
            section: section.trim(),
            dateOfBirth: new Date(dateOfBirth),
            qualification: qualification.trim(),
            yearOfStudy: yearOfStudy.trim(),
            specialization: specialization.trim(),
            bio: bio.trim(),
            address: {
                street: address.street.trim(),
                city: address.city.trim(),
                state: address.state.trim(),
                postalCode: address.postalCode.trim(),
            },
            socialLinks: {
                linkedin: socialLinks.linkedin.trim(),
                github: socialLinks.github.trim(),
            }
        });

        user.isProfileCreated = true;
        await user.save();

        const populatedProfile = await studentProfileModel.findById(profile._id).populate('userId', 'name email');

        return res.status(201).json({ success: true, data: populatedProfile });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
