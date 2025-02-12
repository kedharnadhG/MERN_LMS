import { GraduationCap, TvMinimalPlay } from "lucide-react";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { AuthContext } from "@/context/auth-context";

function StudentViewCommonHeader() {
  const { resetCredentials } = useContext(AuthContext);

  const navigate = useNavigate();
  const handleLogout = () => {
    resetCredentials();
    sessionStorage.clear();
  };

  return (
    <header className="flex items-center justify-between p-4 border-b relative">
      <div className="flex items-center space-x-4">
        <Link to="/home" className="flex items-center hover:text-black">
          <GraduationCap className="h-8 w-8 mr-4" />
          <span className="font-extrabold md:text-xl text-[14px]">
            LMS LEARN
          </span>
        </Link>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            className="text-[14px] md:text-[16px] font-medium"
            onClick={() =>
              location.pathname.includes("/courses")
                ? null
                : navigate("/courses")
            }
          >
            Explore Courses
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-4">
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => navigate("/student-courses")}
          >
            <span className="font-extrabold md:text-xl text-[14px]">
              My Courses
            </span>
            <TvMinimalPlay className="h-8 w-8 cursor-pointer" />
          </div>
          <Button onClick={handleLogout}>Sign Out</Button>
        </div>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;
