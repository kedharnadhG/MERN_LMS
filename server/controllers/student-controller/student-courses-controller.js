import studentCourses from "../../models/StudentCourses.js";

export const getCoursesByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentBoughtCourses = await studentCourses.findOne({
      userId: studentId,
    });

    res.status(200).json({
      success: true,
      data: studentBoughtCourses?.courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Error getting student enrolled courses",
    });
  }
};
