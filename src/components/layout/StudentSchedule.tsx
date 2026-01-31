'use client';

import {
    CalendarOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    LinkOutlined,
    BookOutlined,
} from '@ant-design/icons';
import {
    Calendar,
    Card,
    Row,
    Col,
    Tag,
    Button,
    Badge,
    Divider,
    Space,
    Empty,
    Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { IClassSchedule } from '@/types/classSchedule';

import { useGetMySchedulesQuery } from '@/store/api/classScheduleApi';



export const StudentSchedule = () => {
    const { data } = useGetMySchedulesQuery();
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
    const scheduleData = data?.data;

    if (!scheduleData || !scheduleData.today || !scheduleData.week) {
        return (
            <Card className="w-full">
                <Empty description="No schedule scheduleData available" />
            </Card>
        );
    }

    const todaySchedules = scheduleData.today.schedules || [];
    const weekSchedules = scheduleData.week.schedules || [];

    // Group week schedules by day
    const schedulesByDay = weekSchedules.reduce(
        (acc, schedule) => {
            const dayKey = schedule.weekDay.name;
            if (!acc[dayKey]) {
                acc[dayKey] = [];
            }
            acc[dayKey].push(schedule);
            return acc;
        },
        {} as Record<string, IClassSchedule[]>
    );

    const getCalendarDateCellRender = (value: dayjs.Dayjs) => {
        const dayName = value.format('dddd');
        const schedulesForDay = schedulesByDay[dayName] || [];

        if (schedulesForDay.length === 0) {
            return null;
        }

        return (
            <div className="mt-1">
                <Badge
                    count={schedulesForDay.length}
                    style={{ backgroundColor: '#1890ff' }}
                />
            </div>
        );
    };



    return (
        <div className="w-full space-y-6 p-4">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold ">
                    Class Schedule
                </h1>
            
            </div>

            <Row gutter={[24, 24]}>
                {/* Today's Schedule */}
                <Col xs={24} lg={24}>
                    <Card
                        title={
                            <Space>
                                <CalendarOutlined style={{ color: '#1890ff', fontSize: 18 }} />
                                <span>Today&apos;s Classes</span>
                            </Space>
                        }
                        bordered={false}
                        className="shadow-md h-full"
                        style={{ borderTop: '3px solid #1890ff' }}
                    >
                        {todaySchedules.length === 0 ? (
                            <Empty description="No classes today" />
                        ) : (
                            <Space direction="vertical" style={{ width: '100%' }} size="large">
                                {todaySchedules.map((schedule) => (
                                    <Card
                                        key={schedule.id}
                                        size="small"
                                        style={{
                                            backgroundColor:
                                                schedule.status === 'active' ? '#f0f7ff' : '#f5f5f5',
                                            borderLeft: '4px solid #1890ff',
                                        }}
                                    >
                                        <Space direction="vertical" style={{ width: '100%' }} size="small">
                                            {/* Subject Name */}
                                            <div>
                                                <Tag color="blue">{schedule.subject.code}</Tag>
                                                <h3 className="font-semibold text-lg mt-2">
                                                    {schedule.subject.name}
                                                </h3>
                                            </div>

                                            {/* Time Slot */}
                                            <div className="flex items-center gap-2">
                                                <ClockCircleOutlined style={{ color: '#52c41a' }} />
                                                <span className="font-medium">{schedule.timeSlot.name}</span>
                                            </div>

                                            {/* Faculty */}
                                            <div className="flex items-center gap-2">
                                                <TeamOutlined style={{ color: '#1890ff' }} />
                                                <span>
                                                    <strong>Faculty:</strong> {schedule.faculty.fullName}
                                                </span>
                                            </div>

                                            {/* Room */}
                                            <div className="flex items-center gap-2">
                                                <EnvironmentOutlined style={{ color: '#fa8c16' }} />
                                                <span>
                                                    <strong>Room:</strong> {schedule.room.name} (Floor{' '}
                                                    {schedule.room.levelFloor})
                                                </span>
                                            </div>

                                            {/* Batch */}
                                            <div className="flex items-center gap-2">
                                                <BookOutlined style={{ color: '#eb2f96' }} />
                                                <span>
                                                    <strong>Batch:</strong> {schedule.batch.name}
                                                </span>
                                            </div>

                                            {/* Capacity */}
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Capacity: {schedule.maxCapacity} students
                                            </div>

                                            {/* Zoom Join Button */}
                                            {schedule.zoomSession && schedule.zoomSession.joinUrl && (
                                                <div className="mt-3 pt-3 border-t">
                                                    <Tooltip title="Join Zoom Class">
                                                        <Button
                                                            type="primary"
                                                            size="small"
                                                            icon={<LinkOutlined />}
                                                            href={schedule.zoomSession.joinUrl}
                                                            target="_blank"
                                                            style={{ backgroundColor: '#2f7ed1' }}
                                                        >
                                                            Join Zoom Class
                                                        </Button>
                                                    </Tooltip>
                                                </div>
                                            )}
                                        </Space>
                                    </Card>
                                ))}
                            </Space>
                        )}
                    </Card>
                </Col>

              
                
            </Row>

            {/* Week Overview */}
            <Card
                title={
                    <Space>
                        <CalendarOutlined style={{ color: '#1890ff', fontSize: 18 }} />
                        <span>Week Overview</span>
                    </Space>
                }
                bordered={false}
                className="shadow-md"
                style={{ borderTop: '3px solid #1890ff' }}
            >
                <Row gutter={[16, 16]}>
                    {Object.entries(schedulesByDay).map(([dayName, schedules]) => (
                        <Col xs={24} sm={12} md={8} key={dayName}>
                            <Card
                                size="small"
                                style={{
                                    backgroundColor:
                                        schedules.length === 0
                                            ? '#f5f5f5'
                                            : dayName === dayjs().format('dddd')
                                                ? '#e6f7ff'
                                                : '#fafafa',
                                }}
                            >
                                <div className="text-center">
                                    <div className="font-semibold text-base mb-2">{dayName}</div>
                                    <Badge
                                        count={schedules.length}
                                        style={{
                                            backgroundColor: schedules.length === 0 ? '#d9d9d9' : '#1890ff',
                                        }}
                                        className="mb-2"
                                    />
                                    {schedules.length === 0 ? (
                                        <div className="text-xs text-gray-500">No classes</div>
                                    ) : (
                                        <div className="text-xs text-gray-600 mt-2">
                                            {schedules.map((s) => (
                                                <div key={s.id}>{s.timeSlot.name}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>
        </div>
    );
};
