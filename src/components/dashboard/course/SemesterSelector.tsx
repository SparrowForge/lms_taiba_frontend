import {Card, Select, Typography} from 'antd';

import {ISemester} from '@/types/semester';

interface SemesterSelectorProps {
  semesters: ISemester[];
  selectedSemesterId?: number;
  onSemesterChange: (semesterId: number | undefined) => void;
  loading?: boolean;
}

const SemesterSelector: React.FC<SemesterSelectorProps> = ({
  semesters,
  selectedSemesterId,
  onSemesterChange,
  loading = false,
}) => {
  return (
    <Card className="rounded-2xl shadow-sm" style={{ margin: '12px 12px' }}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Typography.Text strong className="text-base">
            Select Semester
          </Typography.Text>
        </div>

        <Select
          value={selectedSemesterId}
          onChange={onSemesterChange}
          placeholder="Choose a semester to view subjects"
          className="w-full"
          size="large"
          style={{
            borderRadius: '8px',
          }}
          allowClear
          showSearch
          loading={loading}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {semesters.map((semester) => {
            const currentDate = new Date();
            const startDate = new Date(semester.startDate);
            const endDate = new Date(semester.endDate);
            const isCurrent = currentDate >= startDate && currentDate <= endDate;

            return (
              <Select.Option key={semester.id} value={semester.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{semester.name}</span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <Typography.Text type="secondary" className="text-xs">
                    Term {semester.termNo}
                  </Typography.Text>
                </div>
              </Select.Option>
            );
          })}
        </Select>
      </div>
    </Card>
  );
};

export default SemesterSelector;
