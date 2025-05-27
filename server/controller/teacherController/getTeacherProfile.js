import teacherModel from "../../models/teacherModels.js";

export const getTeacherProfile = async (req, res) => {
  const teacherId = req.userId;
  console.log("this is getTeacherProfile",teacherId)
  if (!teacherId) {
    return res.status(400).json({
      success: false,
      message: "Teacher ID is missing from the request",
    });
  }
  try {
    const profile = await teacherModel.findOne({ teacherId }).populate('teacherId', 'name email');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });

  } catch (error) {
    console.error("Error fetching teacher profile:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
