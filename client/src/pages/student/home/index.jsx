import { courseCategories } from "@/config";
import banner from "../../../../public/banner-img.png";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const navigate = useNavigate();

  async function fetchAllStudentCourses() {
    try {
      const response = await fetchStudentViewCourseListService();

      // console.log(response);

      if (response?.success) {
        setStudentViewCoursesList(response?.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleCourseNavigation(getCurrentcourseId) {
    // console.log(getCurrentcourseId);
    const response = await checkCoursePurchaseInfoService(
      getCurrentcourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentcourseId}`);
      } else {
        navigate(`/course/details/${getCurrentcourseId}`);
      }
    }
  }

  async function handleCourseNavigationToCoursesPage(getCurrentCategoryId) {
    // console.log(getCurrentCategoryId, "getCurrentCategoryId");
    sessionStorage.removeItem("filters");
    const currentFilter = { category: [getCurrentCategoryId] };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/courses");
  }

  useEffect(() => {
    fetchAllStudentCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4">
            Learning that gets you closer to your goals
          </h1>
          <p className="text-xl">
            Skills you need to succeed. Courses you can trust. Get started with
            US
          </p>
        </div>
        <div className="lg:w-full mb-8 lg:mb-0">
          <img
            src={banner}
            width={600}
            height={400}
            alt="banner"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </section>
      <section className="py-6 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 sm:grid-cols-3 gap-4">
          {courseCategories.map((category) => (
            <Button
              className="justify-start"
              variant="outline"
              key={category.id}
              onClick={() => handleCourseNavigationToCoursesPage(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </section>

      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Popular Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((course) => (
              <div
                onClick={() => handleCourseNavigation(course?._id)}
                key={course?._id}
                className="border rounded-lg overflow-hidden shadow cursor-pointer"
              >
                <img
                  src={course?.image}
                  alt={course?.title}
                  className="w-full h-40 object-cover"
                  width={300}
                  height={150}
                />
                <div className="p-4">
                  <h3 className="mb-2 font-semibold">{course?.title}</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    {course?.instructorName}
                  </p>
                  <p className="font-bold text-[16px]">${course?.pricing}</p>
                </div>
              </div>
            ))
          ) : (
            <h1>No course found</h1>
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
