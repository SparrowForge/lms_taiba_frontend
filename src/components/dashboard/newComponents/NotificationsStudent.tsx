import {
    BellOutlined,
    CommentOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import { Card } from "antd";

import { LOCALE_KEYS } from "@/constants/localizationKeys";

import { useLocalization } from "@/hooks/useLocalization";

import IconBgColoredCard from "../dashboardui/cards/IconBgColoredCard";

const notifications = [
    {
        text: "New grade posted for Mathematics Quiz",
        time: "Today, 10:23 AM",
        color: "#5190f7",
        bgColor: "#eff6ff",
        bgColorIcon: "#dbeafe",
        icon: <BellOutlined style={{ color: "#5190f7", fontSize: 18 }} />,
    },
    {
        text: "Teacher comment on your English essay",
        time: "Yesterday, 02:15 PM",
        color: "#10b981",
        bgColor: "#ecfdf5",
        bgColorIcon: "#d1fae5",
        icon: <CommentOutlined style={{ color: "#10b981", fontSize: 18 }} />,
    },
    {
        text: "Payment due for September tuition",
        time: "Yesterday, 09:30 AM",
        color: "#ef4444",
        bgColor: "#fef2f2",
        bgColorIcon: "#fee2e2",
        icon: <DollarOutlined style={{ color: "red", fontSize: 18 }} />,
    },
];

const NotificationsStudent = () => {
    const { t } = useLocalization();
    return (
        <Card className="rounded-2xl shadow-sm" style={{ marginTop: "14px", padding:"0px" }}>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-base font-semibold">{t(LOCALE_KEYS.NOTIFICATION)}</h2>
                <span className="text-blue-600 cursor-pointer">
                    {t(LOCALE_KEYS.MARK_ALL_READ)}
                </span>

            </div>
            <div className="flex flex-col gap-2">
                {notifications.map((n, i) => (
                    <IconBgColoredCard
                        key={i}
                        text={n.text}
                        time={n.time}
                        color={n.color}
                        icon={n.icon}
                        bgColor={n.bgColor}
                        bgColorIcon={n.bgColorIcon}
                        rounded="full"
                        textSize="12px"

                    />
                ))}
            </div>
        </Card>
    );
};

export default NotificationsStudent;
