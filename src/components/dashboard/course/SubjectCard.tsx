import {BookOutlined, ClockCircleOutlined, ExperimentOutlined, FileTextOutlined,} from '@ant-design/icons';
import {Card, Divider, Tag, Typography} from 'antd';

import {ISubject} from '@/types/subject';

interface SubjectCardProps {
  subject: ISubject;
  semesterId:number;
  onClick?: () => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onClick, semesterId }) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      case 'archived':
        return 'default';
      default:
        return 'blue';
    }
  };

  console.log(semesterId)
  console.log(subject)

  return (
    <Card
      hoverable
      onClick={onClick}
      className="h-full transition-all hover:shadow-lg"
      style={{ borderRadius: '12px' }}
    >
      <div className="space-y-3">
        {/* Header: Name and Status */}
        <div className="flex items-start justify-between gap-2">
          <Typography.Title level={5} className="mb-0 flex-1">
            {subject.name}
          </Typography.Title>
          <Tag color={getStatusColor(subject.status)}>{subject.status?.toUpperCase()}</Tag>
        </div>

        {/* Subject Code */}
        <div className="flex items-center gap-2">
          <BookOutlined className="text-gray-400" />
          <Typography.Text type="secondary" className="text-sm">
            {subject.code}
          </Typography.Text>
        </div>

        {/* Progress Bar */}
        {/* <div className="w-full">
          <Progress percent={50} status="active" />
        </div> */}

        <Divider className="my-2" />

        <div className="grid grid-cols-3 gap-2">
          {/* Credit Hours */}
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="flex flex-col items-center gap-1">
              <ClockCircleOutlined className="text-blue-500" />
              <Typography.Text className="text-xs text-gray-500">Credits</Typography.Text>
              <Typography.Text strong className="text-sm">
                {subject.creditHours || 0}
              </Typography.Text>
            </div>
          </div>

          {/* Theory Hours */}
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="flex flex-col items-center gap-1">
              <FileTextOutlined className="text-green-500" />
              <Typography.Text className="text-xs text-gray-500">Theory</Typography.Text>
              <Typography.Text strong className="text-sm">
                {subject.theoryHours || 0}h
              </Typography.Text>
            </div>
          </div>

          {/* Practical Hours */}
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <div className="flex flex-col items-center gap-1">
              <ExperimentOutlined className="text-purple-500" />
              <Typography.Text className="text-xs text-gray-500">Practical</Typography.Text>
              <Typography.Text strong className="text-sm">
                {subject.practicalHours || 0}h
              </Typography.Text>
            </div>
          </div>
        </div>


        {subject.description && (
          <>
            <Divider className="my-2" />
          
            <div dangerouslySetInnerHTML={{ __html: subject.description }} />
          </>
        )}
      </div>
    </Card>
  );
};

export default SubjectCard;
