'use client';

import {
  DollarOutlined,
  FileTextOutlined,
  UserAddOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Timeline, Tag, Space } from 'antd';


export interface ActivityDetails {
  amount?: number;
  currency?: string;
  method?: string;
  receiptNo?: string;
  templateName?: string;
  totalAmount?: number;
  programName?: string;
  batchCode?: string;
  batchName?: string;
  enrollmentType?: string;
}

export interface ActivityItem {
  date: string;
  day: string;
  title: string;
  description: string;
  time: string;
  type: 'payment' | 'fee_template' | 'enrollment';
  details: ActivityDetails;
  performedBy: string;
}

export const activityData: ActivityItem[] = [
  {
    date: "2026-01-07",
    day: "Wednesday",
    title: "Installment 1 Paid",
    description: "Payment of 1,474 SAR received via Card",
    time: "2:06 PM",
    type: "payment",
    details: {
      amount: 1474,
      currency: "SAR",
      method: "Card",
      receiptNo: "RCP-20240002",
    },
    performedBy: "Finance Cashier",
  },
  {
    date: "2025-12-07",
    day: "Sunday",
    title: "Admission Fee Paid",
    description: "Payment of 800 SAR received via Cash",
    time: "2:06 PM",
    type: "payment",
    details: {
      amount: 800,
      currency: "SAR",
      method: "Cash",
      receiptNo: "RCP-20240001",
    },
    performedBy: "Finance Cashier",
  },
  {
    date: "2024-09-02",
    day: "Monday",
    title: "Fee Template Assigned",
    description: "Standard fee template assigned. Total: 45,120 SAR",
    time: "6:00 AM",
    type: "fee_template",
    details: {
      templateName: "Standard Diploma Fee",
      totalAmount: 45120,
      currency: "SAR",
    },
    performedBy: "Finance Department",
  },
  {
    date: "2024-09-01",
    day: "Sunday",
    title: "Enrolled in Program",
    description: "Enrolled in Diploma in Civil Engineering as new student",
    time: "6:00 AM",
    type: "enrollment",
    details: {
      programName: "Diploma in Civil Engineering",
      batchCode: "DCE_1447_M_RYD_FT",
      batchName: "Batch 2025-A",
      enrollmentType: "New",
    },
    performedBy: "Registration Office",
  },
];


export function ActivityTimeline() {
  const getIconComponent = (type: string) => {
    const iconProps = {
      style: { fontSize: '20px' },
    };

    switch (type) {
      case 'payment':
        return <DollarOutlined {...iconProps} style={{ ...iconProps.style, color: '#1890ff' }} />;
      case 'fee_template':
        return (
          <FileTextOutlined {...iconProps} style={{ ...iconProps.style, color: '#722ed1' }} />
        );
      case 'enrollment':
        return <UserAddOutlined {...iconProps} style={{ ...iconProps.style, color: '#eb2f96' }} />;
      default:
        return <ClockCircleOutlined {...iconProps} />;
    }
  };

  const renderDetails = (item: ActivityItem) => {
    const details: Array<{ label: string; value: string }> = [];

    if (item.type === 'payment') {
      details.push(
        { label: 'amount', value: `${item.details.amount} ${item.details.currency}` },
        { label: 'method', value: item.details.method || '' },
        { label: 'receipt No.', value: item.details.receiptNo || '' }
      );
    } else if (item.type === 'fee_template') {
      details.push(
        { label: 'template Name', value: item.details.templateName || '' },
        { label: 'total amount', value: `${item.details.totalAmount} ${item.details.currency}` }
      );
    } else if (item.type === 'enrollment') {
      details.push(
        { label: 'batch Code', value: item.details.batchCode || '' },
        { label: 'batch Name', value: item.details.batchName || '' },
        { label: 'enrollment Type', value: item.details.enrollmentType || '' }
      );
    }

    return details;
  };

  // Group activityData by date
  const groupedByDate: { [key: string]: ActivityItem[] } = {};
  activityData.forEach((item) => {
    if (!groupedByDate[item.date]) {
      groupedByDate[item.date] = [];
    }
    groupedByDate[item.date].push(item);
  });

  // Sort dates in descending order
  const dates = Object.keys(groupedByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div style={{ padding: '24px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700 }}>
          <ClockCircleOutlined style={{ marginRight: '8px' }} />
          Activity Timeline
        </h2>
        <p style={{ margin: 0, fontSize: '13px', color: '#8c8c8c' }}>
          Complete history of actions and changes for this student record
        </p>
      </div>

      {dates.map((date) => (
        <div key={date} style={{ marginBottom: '32px' }}>
          <div
            style={{
              backgroundColor: '#4a4a4a',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '16px',
              display: 'inline-block',
            }}
          >
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>

          <Timeline
            activityData={groupedByDate[date].map((item) => ({
              dot: getIconComponent(item.type),
              children: (
                <div style={{ paddingBottom: '24px' }}>
                  <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#000',
                      }}
                    >
                      {item.title}
                    </h3>
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        marginLeft: '16px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.time}
                    </span>
                  </div>

                  <p
                    style={{
                      margin: '4px 0 8px 0',
                      fontSize: '13px',
                      color: '#595959',
                    }}
                  >
                    {item.description}
                  </p>

                  <Space wrap style={{ marginTop: '8px', marginBottom: '8px' }}>
                    {renderDetails(item).map((detail, idx) => (
                      <Tag key={idx} style={{ margin: '2px', padding: '2px 6px' }}>
                        <span style={{ fontSize: '11px' }}>
                          <strong>{detail.label}</strong> {detail.value}
                        </span>
                      </Tag>
                    ))}
                  </Space>

                  <p
                    style={{
                      margin: '4px 0',
                      fontSize: '11px',
                      color: '#8c8c8c',
                    }}
                  >
                    by{' '}
                    <span style={{ color: '#0050b3', cursor: 'pointer' }}>
                      {item.performedBy}
                    </span>
                  </p>
                </div>
              ),
            }))}
          />
        </div>
      ))}
    </div>
  );
}
