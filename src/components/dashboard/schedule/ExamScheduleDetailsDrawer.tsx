'use client';

import { Drawer, Descriptions, Tag, Button } from 'antd';
import dayjs from 'dayjs';

interface ExamScheduleDetailsDrawerProps {
  visible: boolean;
  exam: any | null;
  clickedDate?: string;
  onClose: () => void;
}

function ExamScheduleDetailsDrawer({
  visible,
  exam,
  clickedDate,
  onClose,
}: ExamScheduleDetailsDrawerProps) {
  if (!exam) return null;

  const examDateTime = dayjs(exam.examDatetime);

  const durationText = () => {
    if (!exam.duration) return '-';
    const { hours, minutes } = exam.duration;
    if (hours && minutes) return `${hours}h ${minutes}m`;
    if (hours) return `${hours}h`;
    if (minutes) return `${minutes}m`;
    return '-';
  };

  return (
    <Drawer
      open={visible}
      title="Exam Schedule Details"
      onClose={onClose}
      width={520}
      destroyOnClose
    >
      <Descriptions
        bordered
        size="small"
        column={1}
      >
        <Descriptions.Item label="Exam Name">
          {exam.name}
        </Descriptions.Item>

        <Descriptions.Item label="Subject">
          {exam.subject?.name} ({exam.subject?.code})
        </Descriptions.Item>

        <Descriptions.Item label="Course">
          {exam.course?.name}
        </Descriptions.Item>

        <Descriptions.Item label="Batch">
          {exam.batch?.name}
        </Descriptions.Item>

        <Descriptions.Item label="Semester">
          {exam.semester?.name}
        </Descriptions.Item>

        <Descriptions.Item label="Exam Type">
          {exam.examType?.name}
        </Descriptions.Item>

        <Descriptions.Item label="Marks">
          {exam.marks}
        </Descriptions.Item>

        <Descriptions.Item label="Question Type">
          <Tag color="blue">{exam.questionType?.toUpperCase()}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Questions">
          {exam.questionsCount} questions <br />
          {exam.optionsPerQuestion} options per question
        </Descriptions.Item>

        <Descriptions.Item label="Exam Date">
          {examDateTime.format('DD MMM YYYY')}
        </Descriptions.Item>

        <Descriptions.Item label="Exam Time">
          {examDateTime.format('hh:mm A')}
        </Descriptions.Item>

        <Descriptions.Item label="Duration">
          {durationText()}
        </Descriptions.Item>

        <Descriptions.Item label="Room">
          {exam.room?.name} ({exam.room?.levelFloor})
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Tag color={exam.status === 'active' ? 'green' : 'red'}>
            {exam.status.toUpperCase()}
          </Tag>
        </Descriptions.Item>
      </Descriptions>

      {/* Footer Actions */}
      <div className="mt-4 flex justify-end gap-2">
        <Button onClick={onClose}>Close</Button>

        {/* Optional future action */}
        {/* <Button type="primary">Start Exam</Button> */}
      </div>
    </Drawer>
  );
}

export default ExamScheduleDetailsDrawer;
