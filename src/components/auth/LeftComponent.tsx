"use client"
import React from "react";
import { Card, Row, Col, Typography} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  DashboardOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Image from "next/image";

const { Title, Text } = Typography;

const LeftComponent = () => {
  const { t } = useTranslation();

  const portals = [
    {
      key: "teacher",
      icon: <UserOutlined style={{ fontSize: 24, color: "#fff" }} />,
      title: t("Teacher Portal"),
      subtitle: t("بوابة المعلم"),
    },
    {
      key: "student",
      icon: <BookOutlined style={{ fontSize: 24, color: "#fff" }} />,
      title: t("Student Portal"),
      subtitle: t("بوابة الطالب"),
    },
    {
      key: "parent",
      icon: <TeamOutlined style={{ fontSize: 24, color: "#fff" }} />,
      title: t("Parent Portal"),
      subtitle: t("بوابة ولي الأمر"),
    },
    {
      key: "admin",
      icon: <LineChartOutlined  style={{ fontSize: 24, color: "#fff" }} />,
      title: t("Admin Dashboard"),
      subtitle: t("لوحة الإدارة"),
    },
  ];

  return (
    <div className="bg-[#1F4BCA] w-full  flex flex-col justify-center items-center">
      {/* Logo */}
      <div style={{ marginBottom: 10 }}>
     <Image src="/logo.PNG" alt="logo" width={80} height={80}/>
      </div>

      <Title level={3} style={{ color: "#fff", marginBottom: 0, fontSize:"30px"  }}>
        EduTrain Institute
      </Title>
      <Text style={{ color: "#fff", fontSize:"18px" }}>
        {t("Education ERP System | نظام تخطيط موارد التعليم")}
      </Text>

      <Card className="shadow-2xl "
        style={{
          marginTop: 40,
          background: "#2955d6",
          borderRadius: 12,
          border: "none",
          width: "100%",
          maxWidth: 460,
          textAlign: "center",
          color: "#fff",
          padding: "20px"
        }}
      >
        <Title level={5} style={{ color: "#fff",fontSize:"20px"  }}>
          {t("Complete Education Management Solution")}
        </Title>

        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          {portals.map((item) => (
            <Col xs={12} key={item.key} style={{ textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {item.icon}
                <div>
                  <Text style={{ color: "#fff", fontWeight: 500 }}>
                    {item.title}
                  </Text>
                  <br />
                  <Text style={{ color: "#fff", fontSize: 12 }}>
                    {item.subtitle}
                  </Text>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default LeftComponent;
