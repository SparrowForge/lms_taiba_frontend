"use client"
import { LOCALE_KEYS } from "@/constants/localizationKeys";
import { useLocalization } from "@/hooks/useLocalization";
import {
  LineChartOutlined,
} from "@ant-design/icons";
import { Card, Row, Col, Typography} from "antd";
import { useLocale } from "next-intl";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaChalkboardTeacher } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { PiStudentFill } from "react-icons/pi";

const { Title, Text } = Typography;

const LeftComponent = () => {
  const { t } = useLocalization();
  const locale = useLocale();

  const portals = [
    {
      key: "teacher",
      icon: <FaChalkboardTeacher style={{ fontSize: 28, color: "#92c4fc" }} />,
      title: "Teacher Portal",
      subtitle: "بوابة المعلم",
    },
    {
      key: "student",
      icon: <PiStudentFill style={{ fontSize: 28, color: "#92c4fc" }} />,
      title: "Student Portal",
      subtitle: "بوابة الطالب",
    },
    {
      key: "parent",
      icon: <IoIosPeople style={{ fontSize: 28, color: "#92c4fc" }} />,
      title: "Parent Portal",
      subtitle: "بوابة ولي الأمر",
    },
    {
      key: "admin",
      icon: <LineChartOutlined  style={{ fontSize: 28, color: "#92c4fc" }} />,
      title: "Admin Dashboard",
      subtitle: "لوحة الإدارة",
    },
  ];

  return (
    <div className="bg-[#1F4BCA] w-full  flex flex-col justify-center items-center py-10 md:py-0">
      {/* Logo */}
      <div style={{ marginBottom: 10 }}>
     <Image src="/logo.PNG" alt="logo" width={80} height={80}/>
      </div>

      <Title level={3} style={{ color: "#fff", marginBottom: 0, fontSize:"30px"  }}>
        EduTrain Institute
      </Title>
      <Text style={{ color: "#fff", fontSize:"18px" }}>
        {t(LOCALE_KEYS.ERP_TAGLINE)}
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
          Complete Education Management Solution
        </Title>

        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          {portals.map((item) => (
            <Col xs={12} key={item.key} style={{ textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {item.icon}
                <div>
                  <Text style={{ color: "#fff", fontWeight: 500 }}>
                   {locale === 'en' ?  item.title : item.subtitle }
                  </Text>
                  <br />
                
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
