"use client";
import React from "react";
import { Button, Select, Tag, Card } from "antd";
import {
  FilePdfOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

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

interface Props {
  locale: "en" | "ar";
  materials?: CourseMaterial[]; // make it optional
}

const CourseMaterials: React.FC<Props> = ({ locale, materials = [] }) => {
  const getIcon = (icon: string) => {
    switch (icon) {
      case "pdf":
        return <FilePdfOutlined style={{ fontSize: 22, color: "#1677ff" }} />;
      case "video":
        return <VideoCameraOutlined style={{ fontSize: 22, color: "#ff4d4f" }} />;
      case "assignment":
        return <FileTextOutlined style={{ fontSize: 22, color: "#52c41a" }} />;
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
    <Card style={{margin:"0px"}}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {locale === "ar" ? "المواد الدراسية" : "Course Materials"}
        </h2>
        <Button type="primary">
          {locale === "ar" ? "رفع جديد" : "Upload New"}
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Select defaultValue="all" style={{ width: 160 }}>
          <Select.Option value="all">
            {locale === "ar" ? "جميع الدورات" : "All Courses"}
          </Select.Option>
        </Select>
        <Select defaultValue="all" style={{ width: 160 }}>
          <Select.Option value="all">
            {locale === "ar" ? "جميع الأنواع" : "All Types"}
          </Select.Option>
        </Select>
      </div>

      <div className="flex flex-col gap-3">
        {materials.map((m) => (
          <Card
            key={m.id}
            className="shadow-sm"
            bodyStyle={{ padding: "12px 16px" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getIcon(m.icon)}
                <div>
                  <h3 className="font-medium">
                    {locale === "ar" ? m.localTitle : m.title}
                    <Tag color={getTagColor(m.type)} className="ml-2">
                      {m.type}
                    </Tag>
                  </h3>
                  <p className="text-sm text-gray-500">
                    {m.course} | {m.size} |{" "}
                    {locale === "ar" ? "تم الرفع:" : "Uploaded:"} {m.uploaded}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <EditOutlined style={{ fontSize: 18, cursor: "pointer" }} />
                <DeleteOutlined style={{ fontSize: 18, cursor: "pointer" }} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default CourseMaterials;
