import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { Slider } from "@radix-ui/react-slider";
import { ArrowUpDownIcon, Loader } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loading,
    setLoading,
  } = useContext(StudentContext);

  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  // const [loading, setLoading] = useState(true); // Add a loading state

  // const [searchParams, setSearchParams] = useSearchParams();

  const [searchParams, setSearchParams] = useState(new URLSearchParams());

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    // console.log(indexOfCurrentSection, getSectionId, getCurrentOption);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };
      // console.log(cpyFilters);
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );

      if (indexOfCurrentOption === -1) {
        cpyFilters[getSectionId].push(getCurrentOption.id);
      } else {
        cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  async function fetchAllStudentCourses(filters, sort) {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });
    const response = await fetchStudentViewCourseListService(query);

    // console.log(response);

    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setLoading(false);
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

  useEffect(() => {
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
    setSort("price-lowtohigh");
  }, []);

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null) {
      fetchAllStudentCourses(filters, sort);
    }
  }, [filters, sort]);

  // console.log(filters, "filters");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">All Courses</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-64 space-y-4">
          <div>
            {Object.keys(filterOptions).map((keyItem) => (
              <div key={keyItem} className="p-4 border-b shadow-sm">
                <h3 className=" font-bold mb-3">{keyItem.toUpperCase()}</h3>
                <div className="grid gap-2 mt-2">
                  {filterOptions[keyItem].map((option) => (
                    <Label
                      key={option.id}
                      className="flex font-medium items-center gap-3"
                    >
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[keyItem] &&
                          filters[keyItem].indexOf(option.id) !== -1
                        }
                        onCheckedChange={() =>
                          handleFilterOnChange(keyItem, option)
                        }
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
        <main className="flex-1">
          <div className="flex justify-end items-center mb-4 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 p-5"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="font-medium text-[16px]">Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-black text-sm font-bold">
              {`${studentViewCoursesList?.length} ${
                studentViewCoursesList?.length > 1 ? "Results" : "Result"
              } `}
            </span>
          </div>
          <div className="space-y-4">
            {studentViewCoursesList &&
            loading === false &&
            studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((course) => (
                <Card
                  onClick={() => handleCourseNavigation(course?._id)}
                  className="shadow-md cursor-pointer"
                  key={course?._id}
                >
                  <CardContent className="flex gap-4 p-4">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={course?.image}
                        alt={course?.title}
                        className="w-full h-full object-cover rounded-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {course?.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mb-1">
                        Created By{": "}
                        <span className="font-bold">
                          {course?.instructorName}
                        </span>
                      </p>
                      <p className="text-[16px] text-gray-600 mt-3 mb-2">
                        {`${course?.curriculum?.length} ${
                          course?.curriculum?.length > 1
                            ? "Lectures"
                            : "Lecture"
                        } - ${course?.level.toUpperCase()} Level`}
                      </p>
                      <p className="font-bold text-lg">
                        {`$${course?.pricing}`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : loading ? (
              <Skeleton />
            ) : (
              <h1 className="text-4xl font-extrabold shadow-md">
                No courses found
              </h1>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
