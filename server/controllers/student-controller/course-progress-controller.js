import CourseProgress from "../../models/CourseProgress.js";
import Course from "../../models/Course.js";
import StudentCourses from "../../models/StudentCourses.js";

//after watched the video, mark current lecture as viewed
export const markCurrentLectureAsViewed = async (req, res) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    let progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      progress = new CourseProgress({
        userId,
        courseId,
        lectureProgress: [
          {
            lectureId,
            viewed: true,
            dateViewed: new Date(),
          },
        ],
      });

      await progress.save();
    } else {
      const lectureProgress = progress.lectureProgress.find(
        (lecture) => lecture.lectureId === lectureId
      );

      if (lectureProgress) {
        lectureProgress.viewed = true;
        lectureProgress.dateViewed = new Date();
      } else {
        progress.lectureProgress.push({
          lectureId,
          viewed: true,
          dateViewed: new Date(),
        });
      }

      await progress.save();
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    //check if all the lectures are viewed or not
    const isAllLecturesViewed =
      progress.lectureProgress.length === course.curriculum.length &&
      progress.lectureProgress.every((lecture) => lecture.viewed);

    if (isAllLecturesViewed) {
      progress.completed = true;
      progress.completionDate = new Date();

      await progress.save();
    }

    res.status(200).json({
      success: true,
      message: "Current lecture marked as viewed successfully",
      data: progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Error marking current lecture as viewed",
    });
  }
};

//get current course progress
export const getCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const studentPurchasedCourses = await StudentCourses.findOne({ userId });

    const isCurrentCoursePurchasedByCurrentUserOrNot =
      studentPurchasedCourses?.courses?.findIndex(
        (course) => course.courseId === courseId
      ) > -1;

    //if current course is not purchased
    if (!isCurrentCoursePurchasedByCurrentUserOrNot) {
      return res.status(200).json({
        success: true,
        data: {
          isPurchase: false,
        },
        message: "You have not purchased this course yet",
      });
    }

    //if current course is purchased, so check the progress
    const currentUserCourseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    //if no progress found
    if (
      !currentUserCourseProgress ||
      currentUserCourseProgress?.lectureProgress?.length === 0
    ) {
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
      return res.status(200).json({
        success: true,
        message: "No progress found, you can start watching the course",
        data: {
          courseDetails: course,
          progress: [],
          isPurchased: true,
        },
      });
    }

    const courseDetails = await Course.findById(courseId);

    //if progress found
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: currentUserCourseProgress.lectureProgress,
        completed: currentUserCourseProgress.completed,
        completionDate: currentUserCourseProgress.completionDate,
        isPurchased: true,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Error getting current course progress",
    });
  }
};

//reset course progress
export const resetCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "No progress found",
      });
    }

    progress.lectureProgress = [];
    progress.completed = false;
    progress.completionDate = null;

    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Current course progress reset successfully",
      data: progress,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Error resetting current course progress",
    });
  }
};
