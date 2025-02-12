import MediaProgressBar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Upload } from "lucide-react";
import React, { useContext, useRef } from "react";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

  const handleNewLecture = () => {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  };

  const handleCourseTitleChange = (event, currIndex) => {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    // console.log(cpyCourseCurriculumFormData, currIndex); //on what index we are typing

    cpyCourseCurriculumFormData[currIndex] = {
      ...cpyCourseCurriculumFormData[currIndex], //getting existing data
      title: event.target.value,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);

    // console.log(cpyCourseCurriculumFormData);
  };

  const handleFreePreviewChange = (currValue, currIndex) => {
    // console.log(currValue, currIndex);
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currIndex] = {
      ...cpyCourseCurriculumFormData[currIndex],
      freePreview: currValue,
    };
    setCourseCurriculumFormData(cpyCourseCurriculumFormData);

    // console.log(cpyCourseCurriculumFormData);
  };

  const handleSingleLectureUpload = async (event, currIndex) => {
    // console.log(event.target.files);
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        // console.log(response, "response");
        if (response.success) {
          let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
          cpyCourseCurriculumFormData[currIndex] = {
            ...cpyCourseCurriculumFormData[currIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  async function handleReplaceVideo(currIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];

    const getCurrentVideoPublicId =
      cpyCourseCurriculumFormData[currIndex].public_id;

    const deleteCurrentMediaResponse = await mediaDeleteService(
      getCurrentVideoPublicId
    );

    if (deleteCurrentMediaResponse.success) {
      cpyCourseCurriculumFormData[currIndex] = {
        ...cpyCourseCurriculumFormData[currIndex],
        videoUrl: "",
        public_id: "",
      };

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  // console.log(courseCurriculumFormData);

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }

  function handleOpenBulkUploadDialog() {
    bulkUploadInputRef.current?.click();
  }

  function areAllCourseCurriculumFormDataObjectsEmpty(arrFormData) {
    return arrFormData.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }

  const handleMediaBulkUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files);

    const bulkFormData = new FormData();

    selectedFiles.forEach((file) => {
      bulkFormData.append("files", file);
    });

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );
      // console.log(response, "Bulk-response");

      if (response?.success) {
        let cpyCourseCurriculumFormData =
          areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)
            ? []
            : [...courseCurriculumFormData];

        // console.log(
        //   courseCurriculumFormData,
        //   cpyCourseCurriculumFormData,
        //   "cpyCourseCurriculumFormData"
        // );

        cpyCourseCurriculumFormData = [
          ...cpyCourseCurriculumFormData,
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${
              cpyCourseCurriculumFormData.length + (index + 1)
            }`,
            freePreview: false,
          })),
        ];
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);

        setMediaUploadProgress(false);
      }
    } catch (error) {
      console.log(error);
    }

    // console.log(selectedFiles);
  };

  const handleDeleteLecture = async (currIndex) => {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    // console.log(cpyCourseCurriculumFormData[currIndex]);

    const getCurrentSelectedVideoPublicId =
      cpyCourseCurriculumFormData[currIndex].public_id;

    const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);

    // console.log(response, "response");

    if (response.success) {
      cpyCourseCurriculumFormData.splice(currIndex, 1);

      console.log(cpyCourseCurriculumFormData);

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between flex-row">
        <CardTitle>Create Course Curriculum</CardTitle>
        <div>
          <Input
            type="file"
            accept="video/*"
            multiple
            ref={bulkUploadInputRef}
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="cursor-pointer"
            onClick={handleOpenBulkUploadDialog}
          >
            <Upload className="w-4 h-5 mr-2" /> Bulk Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
          onClick={handleNewLecture}
        >
          Add Lecture
        </Button>
        <div className="p-4">
          {mediaUploadProgress ? (
            <MediaProgressBar
              isMediaUploading={mediaUploadProgress}
              progress={mediaUploadProgressPercentage}
            />
          ) : null}
        </div>
        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((curriculumItem, index) => (
            <div key={index + 1} className="border p-5 rounded-md">
              <div className="flex gap-5 items-center">
                <h3 className="font-semibold">Lecture {index + 1}</h3>
                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter Lecture Title"
                  className="max-w-96"
                  onChange={(event) => handleCourseTitleChange(event, index)}
                  value={courseCurriculumFormData[index]?.title}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                    checked={courseCurriculumFormData[index]?.freePreview}
                    id={`freePreview-${index + 1}`}
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>
                    Free Preview
                  </Label>
                </div>
              </div>
              <div className="mt-6">
                {courseCurriculumFormData[index]?.videoUrl ? (
                  <div className="flex gap-5 items-center">
                    <VideoPlayer
                      url={courseCurriculumFormData[index]?.videoUrl}
                      width="450px"
                      height="200px"
                    />
                    <Button onClick={() => handleReplaceVideo(index)}>
                      Replace Video
                    </Button>
                    <Button
                      className="bg-red-900"
                      onClick={() => handleDeleteLecture(index)}
                    >
                      Delete Video
                    </Button>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    className="cursor-pointer mb-4"
                    onChange={(event) => {
                      handleSingleLectureUpload(event, index);
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
