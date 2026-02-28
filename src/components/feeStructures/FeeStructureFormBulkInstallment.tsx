'use client';

import { Button, Card, Col, DatePicker, Input, InputNumber, Row, Select } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

import { Status } from '@/enums';

interface PaymentRow {
  id: string;
  semester: string | number;
  sequenceNo: number;
  paymentLabel: string;
  durationMonths: number;
  amount: number;
  dueDate: dayjs.Dayjs | null;
  semesterStartDate: string;
  semesterEndDate: string;
}

interface InstallmentSectionProps {
  selectedBatch: any;
  semesters: any[];
  listStatus: { status: Status };
  paymentRows: PaymentRow[];
  semesterOptions: { label: string; value: string }[];
  totalFees: any;
  form: any;
  formatForDisplay: (n: number) => number;
  calculateAmountPerPeriod: (totalFees: number, periodCount: number) => number;
  getMissingSemesterNumbers: () => string;
  getBreakSemesterInfo: () => { count: number; names: string } | null;
  updatePaymentRow: (id: string, field: string, value: any) => void;
  setPaymentRows: React.Dispatch<React.SetStateAction<PaymentRow[]>>;
  router: any;
}

export function InstallmentSection(props: InstallmentSectionProps) {
  const {
    selectedBatch,
    semesters,
    listStatus,
    paymentRows,
    semesterOptions,
    totalFees,
    form,
    formatForDisplay,
    calculateAmountPerPeriod,
    getMissingSemesterNumbers,
    getBreakSemesterInfo,
    updatePaymentRow,
    setPaymentRows,
    router,
  } = props;

  if (!selectedBatch) return null;

  return (
    <Card title="Fee Structure Details (Installment)" style={{ marginBottom: 16 }}>
      {/* Show helpful note when no semesters exist */}
      {semesters.length === 0 && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '6px',
            border: '1px solid #ffd591',
            fontSize: '13px',
          }}
        >
          <p style={{ color: '#d46b08', margin: 0 }}>
            <strong>Note:</strong> This batch is configured for{' '}
            {selectedBatch.course?.durationInSemesters || 0} semesters, but no semester records
            exist yet. You'll need to create the semester records first to generate fee structure
            rows.
          </p>
        </div>
      )}

      {/* Show warning when some semesters are missing */}
      {semesters.length > 0 && semesters.length < selectedBatch.course?.durationInSemesters && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '16px',
            borderRadius: '6px',
            border: '1px solid #ffccc7',
            fontSize: '13px',
          }}
        >
          <p style={{ color: '#cf1322', margin: 0, marginBottom: '8px' }}>
            <strong>⚠️ Warning:</strong> This batch is configured for{' '}
            {selectedBatch.course?.durationInSemesters || 0} semesters, but only {semesters.length}{' '}
            semester records were found.
          </p>
          <p style={{ color: '#434343', margin: 0, marginBottom: '8px', fontSize: '12px' }}>
            <strong>Missing semesters:</strong> {getMissingSemesterNumbers()}
          </p>
          <p style={{ color: '#666', margin: 0, fontSize: '12px' }}>
            You can proceed with the available semesters, but consider creating the missing ones for
            a complete fee structure.
          </p>
          <div style={{ marginTop: '8px' }}>
            <Button
              type="primary"
              danger
              size="small"
              onClick={() => {
                if (selectedBatch) {
                  sessionStorage.setItem(
                    'batchForSemesterCreation',
                    JSON.stringify({
                      batchId: selectedBatch.id,
                      batchName: selectedBatch.name,
                      courseName: selectedBatch.course?.name,
                      durationInSemesters: selectedBatch.course?.durationInSemesters,
                      missingSemesters: getMissingSemesterNumbers(),
                    }),
                  );
                }
                router.push('/semesters/create');
              }}
              style={{ marginRight: '8px' }}
            >
              Create Missing Semesters
            </Button>
            <Button type="default" size="small" onClick={() => window.open('/semesters', '_blank')}>
              View All Semesters
            </Button>
          </div>
        </div>
      )}

      {/* Show break semester information */}
      {(() => {
        const breakInfo = getBreakSemesterInfo();
        if (breakInfo) {
          return (
            <div
              style={{
                padding: '12px 16px',
                marginBottom: '16px',
                borderRadius: '6px',
                border: '1px solid #d9f7be',
                backgroundColor: '#f6ffed',
                fontSize: '13px',
              }}
            >
              <p style={{ color: '#389e0d', margin: 0, marginBottom: '4px' }}>
                <strong>ℹ️ Break Semesters Excluded:</strong> {breakInfo.count} break semester
                {breakInfo.count !== 1 ? 's' : ''} ({breakInfo.names}){' '}
                {breakInfo.count !== 1 ? 'are' : 'is'} excluded from fee calculations.
              </p>
              <p style={{ color: '#666', margin: 0, fontSize: '12px' }}>
                Only active semesters are included in the installment payment structure.
              </p>
            </div>
          );
        }
        return null;
      })()}

      {/* Show totals summary for installment payment */}
      {paymentRows.length > 0 && (
        <div
          style={{
            padding: '12px',
            marginBottom: '16px',
            borderRadius: '6px',
            border: '1px solid #e1e4e8',
          }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <strong>Total Fees:</strong> {Number(totalFees || 0).toFixed(2)}
            </Col>
            <Col span={6}>
              <strong>Admission Fee:</strong>{' '}
              {Number(form.getFieldValue('admissionFee') || 0).toFixed(2)}
            </Col>
            <Col span={6}>
              <strong>Remaining After Admission:</strong>{' '}
              {Math.max(
                0,
                Number(totalFees || 0) - Number(form.getFieldValue('admissionFee') || 0),
              ).toFixed(2)}
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: '8px' }}>
            <Col span={6}>
              <strong>Semester Sum ({paymentRows.length} active semesters):</strong>{' '}
              {formatForDisplay(paymentRows.reduce((sum, row) => sum + row.amount, 0)).toFixed(2)}
            </Col>
            <Col span={6}>
              <strong>Amount Per Semester:</strong>{' '}
              {paymentRows.length > 0
                ? formatForDisplay(
                    paymentRows.reduce((sum, row) => sum + row.amount, 0) / paymentRows.length,
                  ).toFixed(2)
                : '0.00'}
            </Col>
            <Col span={6}>
              <strong>Difference:</strong>{' '}
              {formatForDisplay(
                Math.abs(
                  Math.max(
                    0,
                    Number(totalFees || 0) - Number(form.getFieldValue('admissionFee') || 0),
                  ) - paymentRows.reduce((sum, row) => sum + row.amount, 0),
                ),
              ).toFixed(2)}
            </Col>
          </Row>
          <Row style={{ marginTop: '12px' }}>
            <Col span={24}>
              <Button
                type="dashed"
                size="small"
                onClick={() => {
                  const totalFeesNumber = Number(totalFees || 0);
                  if (totalFeesNumber > 0 && paymentRows.length > 0) {
                    const nonBreakSemesterCount = paymentRows.length;
                    const amountPerSemester = calculateAmountPerPeriod(
                      totalFeesNumber,
                      nonBreakSemesterCount,
                    );

                    setPaymentRows((prev) =>
                      prev.map((row) => ({
                        ...row,
                        amount: amountPerSemester,
                      })),
                    );
                  }
                }}
                disabled={!totalFees || paymentRows.length === 0}
              >
                Auto-Distribute Remaining Fees Across {paymentRows.length} Active Semesters
              </Button>
            </Col>
          </Row>
        </div>
      )}

      {listStatus.status === Status.LOADING ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          <p>Loading semester data...</p>
        </div>
      ) : semesters.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '20px',
            color: '#ff4d4f',
            borderRadius: '6px',
            border: '1px solid #ffccc7',
          }}
        >
          <p style={{ color: '#cf1322', fontWeight: 500, marginBottom: '12px' }}>
            ⚠️ No semesters found for this batch
          </p>
          <p style={{ color: '#434343', marginBottom: '16px' }}>
            This batch has {selectedBatch?.course?.durationInSemesters || 0} semesters configured,
            but no semester records exist.
          </p>
          <p style={{ color: '#666', fontSize: '12px', marginBottom: '16px' }}>
            You need to create semester records before you can generate fee structure rows.
          </p>
          <Button
            type="primary"
            danger
            onClick={() => {
              if (selectedBatch) {
                sessionStorage.setItem(
                  'batchForSemesterCreation',
                  JSON.stringify({
                    batchId: selectedBatch.id,
                    batchName: selectedBatch.name,
                    courseName: selectedBatch.course?.name,
                    durationInSemesters: selectedBatch.course?.durationInSemesters,
                  }),
                );
              }
              router.push('/semesters/create');
            }}
            style={{ marginRight: '8px' }}
          >
            Create Semesters
          </Button>
          <Button type="default" onClick={() => window.open('/semesters', '_blank')}>
            View All Semesters
          </Button>
        </div>
      ) : paymentRows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          <p>Select a batch to automatically generate fee structure rows for each semester</p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>
            Each row represents a fee structure for a specific semester
          </p>
        </div>
      ) : (
        <>
          <div
            style={{
              padding: '8px 12px',
              marginBottom: '16px',
              borderRadius: '4px',
              border: '1px solid #91d5ff',
              fontSize: '12px',
            }}
          >
            💡 <strong>Tip:</strong> The auto-distribute function will: 1) Subtract admission fee
            from total fees, 2) Divide the remaining amount across all semesters. You can also
            manually adjust individual semester amounts.
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Semester</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>
                    Start Date
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>
                    Sequence No
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>
                    Payment Label
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>
                    Duration (Months)
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600 }}>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {paymentRows.map((row) => (
                  <tr key={row.id}>
                    <td style={{ padding: '12px' }}>
                      <Select
                        style={{ width: '100%' }}
                        placeholder="Select Semester"
                        disabled
                        value={row.semester}
                        onChange={(value) => updatePaymentRow(row.id, 'semester', value)}
                        options={semesterOptions}
                      />
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Input
                        value={
                          row.semesterStartDate
                            ? dayjs(row.semesterStartDate).format('YYYY-MM-DD')
                            : 'N/A'
                        }
                        disabled
                        style={{
                          textAlign: 'center',
                          backgroundColor: '#f5f5f5',
                          color: '#666',
                        }}
                      />
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Input value={row.sequenceNo} disabled style={{ textAlign: 'center' }} />
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Input
                        placeholder="e.g., Tuition Fee"
                        value={row.paymentLabel}
                        onChange={(e) => updatePaymentRow(row.id, 'paymentLabel', e.target.value)}
                      />
                    </td>
                    <td style={{ padding: '12px' }}>
                      <InputNumber
                        style={{ width: '100%', backgroundColor: '#f5f5f5', color: '#666' }}
                        min={1}
                        value={row.durationMonths}
                        disabled
                      />
                    </td>
                    <td style={{ padding: '12px' }}>
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        step={0.01}
                        placeholder="0.00"
                        value={formatForDisplay(row.amount)}
                        onChange={(value) => updatePaymentRow(row.id, 'amount', value)}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      />
                    </td>
                    <td style={{ padding: '12px' }}>
                      <DatePicker
                        style={{ width: '100%' }}
                        placeholder="mm/dd/yyyy"
                        value={row.dueDate}
                        onChange={(date) => updatePaymentRow(row.id, 'dueDate', date)}
                        status={!row.dueDate ? 'error' : undefined}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
}

