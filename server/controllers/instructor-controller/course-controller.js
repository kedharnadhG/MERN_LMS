import Course from "../../models/Course.js";

export const addNewCourse = async (req, res) => {
  try {
    const courseData = req.body;

    const newCourse = new Course(courseData);
    const saveCourse = await newCourse.save();

    if (saveCourse) {
      res.status(201).json({
        success: true,
        message: "Course added successfully",
        data: saveCourse,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Error adding new course",
    });
  }
};
export const getAllCourses = async (req, res) => {
  try {
    const coursesList = await Course.find({});

    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Error adding new course",
    });
  }
};
export const getCourseDetailsById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const courseDetails = await Course.findById(courseId);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Error adding new course",
    });
  }
};
export const updateCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const courseDataToUpdate = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      courseDataToUpdate,
      {
        new: true,
      }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Error adding new course",
    });
  }
};
