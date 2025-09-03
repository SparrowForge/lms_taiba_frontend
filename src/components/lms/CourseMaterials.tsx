"use client";
import React from "react";
import { Button, Select, Tag, Card } from "antd";
import {
  FilePdfOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useLocale } from "next-intl";

type MaterialType = "Lecture" | "Video" | "Assignment";

interface CourseMaterial {
  id: string;
  title: string; // English
  localTitle: string; // Arabic
  type: MaterialType;
  course: string;
  size: string;
  uploaded: string;
  icon: "pdf" | "video" | "assignment";
}

const materials: CourseMaterial[] = [
  {
    id: "1",
    title: "Introduction to JavaScript",
    localTitle: "مقدمة في جافا سكربت",
    type: "Lecture",
    course: "Web Development",
    size: "6.2 MB",
    uploaded: "Yesterday",
    icon: "pdf",
  },
  {
    id: "2",
    title: "Data Modeling Tutorial",
    localTitle: "درس نمذجة البيانات",
    type: "Video",
    course: "Data Science",
    size: "128 MB",
    uploaded: "3 days ago",
    icon: "video",
  },
  {
    id: "3",
    title: "UI Design Principles",
    localTitle: "مبادئ تصميم واجهة المستخدم",
    type: "Assignment",
    course: "UI/UX Design",
    size: "1.4 MB",
    uploaded: "1 week ago",
    icon: "assignment",
  },
];

const CourseMaterials = () => {
  const locale = useLocale();

const getIcon = (icon: string) => {
  switch (icon) {
    case "pdf":
      return (
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100">
          <FilePdfOutlined style={{ fontSize: 22, color: "#1677ff" }} />
        </div>
      );
    case "video":
      return (
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-100">
          <VideoCameraOutlined style={{ fontSize: 22, color: "#ff4d4f" }} />
        </div>
      );
    case "assignment":
      return (
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-100">
          <FileTextOutlined style={{ fontSize: 22, color: "#52c41a" }} />
        </div>
      );
    default:
      return null;
  }
};


  const getTagColor = (type: MaterialType) => {
    switch (type) {
      case "Lecture":
        return "blue";
      case "Video":
        return "red";
      case "Assignment":
        return "green";
    }
  };

  return (
    <Card style={{ margin: 0 }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">
          {locale === "ar" ? "المواد الدراسية" : "Course Materials"}
        </h2>
        <Button type="primary">
          <PlusOutlined />
          {locale === "ar" ? "رفع جديد" : "Upload New"}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 w-full">
        <Select
          defaultValue="allCourses"
          style={{ width: "100%" }}
          options={[
            { value: "allCourses", label: locale === "ar" ? "جميع الدورات" : "All Courses" },
          ]}
        />
        <Select
          defaultValue="allTypes"
          style={{ width: "100%" }}
          options={[
            { value: "allTypes", label: locale === "ar" ? "جميع الأنواع" : "All Types" },
          ]}
        />
      </div>

      {/* Materials List */}
      <div className="flex flex-col gap-3">
        {materials.map((m) => (
          <Card
            key={m.id}
            className="shadow-sm"
            bodyStyle={{ padding: "12px 16px" }}
          >
            <div className="flex items-center justify-between">
              {/* Left: Icon + Info */}
              <div className="flex items-center gap-3">
              <div className = {` bg-${getIcon(m.type)}`}>  {getIcon(m.icon)}</div>
                <div>
                  <h3 className="font-medium text-lg">
                    {locale === "ar" ? m.localTitle : m.title}

                  </h3>
                  <p className="text-sm text-gray-500">
                    {m.course} | {m.size} {" "}

                  </p>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex justify-center items-center gap-4">
                <div className="flex flex-col justify-center mt-4">
                  <h1>
                    <Tag color={getTagColor(m.type)} className="" style={{ border: "0"}}>
                      {m.type}
                    </Tag>
                  </h1>
                  <p>
                    {locale === "ar" ? "تم الرفع:" : "Uploaded:"} {m.uploaded}
                  </p>
                </div>
                <div className="flex gap-1">
                  <EditOutlined style={{ fontSize: 18, cursor: "pointer" }} />
                  <EyeOutlined style={{ fontSize: 18, cursor: "pointer" }}/>
                  <DeleteOutlined style={{ fontSize: 18, cursor: "pointer" }} />
                </div>

              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default CourseMaterials;
