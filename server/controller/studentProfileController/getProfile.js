import studentProfileModel from "../../models/studentProfileModels.js";

export const getProfile = async (req, res) => {
    const userId = req.userId;

    console.log("this is student Profile "+ userId)
    try {
        const profile = await studentProfileModel.findOne({ userId }).populate('userId', 'name email');

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: profile,
        });

    } catch (error) {
        console.error("Error fetching profile:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
