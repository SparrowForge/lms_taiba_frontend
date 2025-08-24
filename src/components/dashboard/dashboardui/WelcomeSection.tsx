"use client"
import { Button, Card, Typography } from "antd";

import {useAuth} from '@/hooks/useAuth';

const { Title, Text } = Typography;


const WelcomeSection = () => {
    const { getUserFullName } = useAuth();

    // will get role form the localstorage to chage the layout
    const role: "teacher" | "student" = "teacher";

    // Get today’s date
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return (
        <div
            className={`m-6 ${role === "teacher" ? "border-l-8 border-l-[#1F4BCA] rounded-2xl" : ""}`}
        >
            <Card
                className={`mx-10 ${role === "teacher" ? "border-l-4 border-l-[#1F4BCA]" : "text-white"
                    }`}
                style={{
                    backgroundColor: role === "teacher" ? "white" : "#1F4BCA",
                    color: role === "teacher" ? "inherit" : "#fff",
                }}
                styles={{
                    body: { padding: "24px" },

                }}
            >
                <div className="flex justify-between items-center">
                    <div className="">
                        <Title
                            level={2}
                            style={{ color: role === "teacher" ? "#1f2937" : "#fff" }}
                        >
                            Welcome back, {getUserFullName()}!
                        </Title>
                        <Text
                            style={{ color: role === "teacher" ? "#1f2937" : "#fff" }}
                        >
                            {role === "teacher"
                                ? `${formattedDate} | You have 3 classes today`
                                : `First Semester, Academic Year 2023-2024 | ${formattedDate}`}
                        </Text>
                    </div>
                    {/* Right side content (only for student) */}
                      {
                        role === "teacher" ? (
                            <Button style={{
                                backgroundColor: "#1F4BCA",
                                color: "#fff"
                            }}>View Schedule</Button>
                        )
                        :
                        (
                            <div className="text-right">
                            <Title level={2} style={{ color: role === "teacher" ? "#1f2937" : "#fff" }}>
                                {today.getDate()}
                            </Title>
                            <Text style={{ color: role === "teacher" ? "#1f2937" : "#fff" }}>
                                {today.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                            </Text>
                        </div>
                        )
                    }
                 

                  
                </div>


            </Card>
        </div>



    );
};

export default WelcomeSection;