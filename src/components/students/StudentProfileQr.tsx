"use client";


import { QRCode, Card, Space, Typography } from "antd";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { LOCALE_KEYS } from "@/constants/localizationKeys";
import { useLocalization } from "@/hooks/useLocalization";

const { Text } = Typography;



export default function StudentProfileQr() {
  const [profileUrl, setProfileUrl] = useState("");
  const {user} = useAuth()
  const {t} = useLocalization()

  useEffect(() => {
    // Get current page URL dynamically on client
    if (typeof window !== "undefined") {
      setProfileUrl(window.location.href);
    } else {
      // Fallback for SSR
      const base = process.env.NEXT_PUBLIC_BASE_URL || "";
      setProfileUrl(`${base}/en/students/${user?.student.id}`);
    }
  }, [user]);

  return (
    <Card title={t(LOCALE_KEYS.STUDENT_QR_CODE)}>
      <Space direction="vertical" align="center" style={{ width: "100%" }}>
        {profileUrl ? (
          <QRCode
            value={profileUrl}
            size={180}
            color="#000"
            bgColor="#fff"
          />
        ) : (
          <Text>Loading QR...</Text>
        )}

        <Text type="secondary" style={{ fontSize: 12 }}>
          Scan to open profile
        </Text>
      </Space>
    </Card>
  );
}
