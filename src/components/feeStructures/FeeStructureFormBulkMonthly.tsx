'use client';

import { Button, Card, Col, DatePicker, Input, InputNumber, Row } from 'antd';
import React from 'react';

import { Status } from '@/enums';

interface MonthlyPaymentRow {
  id: string;
  semester: string | number;
  semesterName: string;
  monthName: string;
  sequenceNo: number;
  paymentLabel: string;
  amount: number;
  dueDate: any;
  isBreak: boolean;
}

interface MonthlySectionProps {
  selectedBatch: any;
  semesters: any[];
  listStatus: { status: Status };
  monthlyPaymentRows: MonthlyPaymentRow[];
  totalFees: any;
  form: any;
  formatForDisplay: (n: number) => number;
  calculateAmountPerPeriod: (totalFees: number, periodCount: number) => number;
  getMissingSemesterNumbers: () => string;
  setMonthlyPaymentRows: React.Dispatch<React.SetStateAction<MonthlyPaymentRow[]>>;
  handleMonthBreakChange: (id: string, isBreak: boolean) => void;
  router: any;
}

export function MonthlySection(props: MonthlySectionProps) {
  const {
    selectedBatch,
    semesters,
    listStatus,
    monthlyPaymentRows,
    totalFees,
    form,
    formatForDisplay,
    calculateAmountPerPeriod,
    getMissingSemesterNumbers,
    setMonthlyPaymentRows,
    handleMonthBreakChange,
    router,
  } = props;

  if (!selectedBatch) return null;

  return (
    <Card title="Monthly Payment Details" style={{ marginBottom: 16 }}>
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
            exist yet. You'll need to create the semester records first to generate monthly payment
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

      {/* Show monthly totals summary for monthly payment */}
      {monthlyPaymentRows.length > 0 && (
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
              <strong>Monthly Sum:</strong>{' '}
              {formatForDisplay(
                monthlyPaymentRows.reduce((sum, row) => sum + row.amount, 0),
              ).toFixed(2)}
            </Col>
            <Col span={6}>
              <strong>Amount Per Month:</strong>{' '}
              {(() => {
                const activeMonths = monthlyPaymentRows.filter((row) => !row.isBreak);
                return activeMonths.length > 0
                  ? formatForDisplay(
                      monthlyPaymentRows.reduce((sum, row) => sum + row.amount, 0) /
                        activeMonths.length,
                    ).toFixed(2)
                  : '0.00';
              })()}
            </Col>
            <Col span={6}>
              <strong>Difference:</strong>{' '}
              {formatForDisplay(
                Math.abs(
                  Number(totalFees || 0) -
                    (Number(form.getFieldValue('admissionFee') || 0) +
                      monthlyPaymentRows.reduce((sum, row) => sum + row.amount, 0)),
                ),
              ).toFixed(2)}
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: '8px' }}>
            <Col span={24}>
              <strong>Semesters:</strong>{' '}
              {(() => {
                const uniqueSemesters = [
                  ...new Set(monthlyPaymentRows.map((row) => row.semesterName)),
                ];
                return uniqueSemesters.length;
              })()}{' '}
              (
              {(() => {
                const uniqueSemesters = [
                  ...new Set(monthlyPaymentRows.map((row) => row.semesterName)),
                ];
                return uniqueSemesters.join(', ');
              })()}
              )
            </Col>
          </Row>
          <Row style={{ marginTop: '12px' }}>
            <Col span={24}>
              <Button
                type="dashed"
                size="small"
                onClick={() => {
                  const totalFeesNumber = Number(totalFees || 0);
                  if (totalFeesNumber > 0 && monthlyPaymentRows.length > 0) {
                    const activeMonths = monthlyPaymentRows.filter((row) => !row.isBreak);
                    const activeMonthCount = activeMonths.length;

                    if (activeMonthCount > 0) {
                      const amountPerMonth = calculateAmountPerPeriod(
                        totalFeesNumber,
                        activeMonthCount,
                      );

                      setMonthlyPaymentRows((prev) =>
                        prev.map((row) => ({
                          ...row,
                          amount: row.isBreak ? 0 : amountPerMonth,
                        })),
                      );
                    }
                  }
                }}
                disabled={!totalFees || monthlyPaymentRows.length === 0}
              >
                Auto-Distribute Remaining Fees Across{' '}
                {monthlyPaymentRows.filter((row) => !row.isBreak).length} Active Months
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
            You need to create semester records before you can generate monthly payment rows.
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
      ) : monthlyPaymentRows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          <p>Select a batch to automatically generate monthly payment rows</p>
          <p style={{ fontSize: '12px', marginTop: '8px' }}>
            Each row represents a monthly payment within a semester
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
            from total fees, 2) Divide the remaining amount across all months. You can also manually
            adjust individual monthly amounts.
          </div>
          <div style={{ overflowX: 'auto' }}>
            {(() => {
              const groupedBySemester = monthlyPaymentRows.reduce<Record<string, MonthlyPaymentRow[]>>(
                (groups, row) => {
                  const semesterName = row.semesterName;
                  if (!groups[semesterName]) {
                    groups[semesterName] = [];
                  }
                  groups[semesterName].push(row);
                  return groups;
                },
                {},
              );

              return Object.entries(groupedBySemester).map(([semesterName, rows]) => (
                  <div key={semesterName} style={{ marginBottom: '24px' }}>
                    <div
                      style={{
                        padding: '12px 16px',
                        border: '1px solid #e1e4e8',
                        borderRadius: '6px 6px 0 0',
                        borderBottom: 'none',
                        fontWeight: 600,
                        color: '#24292e',
                        fontSize: '14px',
                      }}
                    >
                      📚 {semesterName} - {rows.length} month{rows.length !== 1 ? 's' : ''}
                    </div>

                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        border: '1px solid #e1e4e8',
                      }}
                    >
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e1e4e8' }}>
                          <th
                            style={{
                              padding: '10px 12px',
                              textAlign: 'left',
                              fontWeight: 600,
                              fontSize: '13px',
                            }}
                          >
                            Month
                          </th>
                          <th
                            style={{
                              padding: '10px 12px',
                              textAlign: 'left',
                              fontWeight: 600,
                              fontSize: '13px',
                            }}
                          >
                            Sequence No
                          </th>
                          <th
                            style={{
                              padding: '10px 12px',
                              textAlign: 'left',
                              fontWeight: 600,
                              fontSize: '13px',
                            }}
                          >
                            Payment Label
                          </th>
                          <th
                            style={{
                              padding: '10px 12px',
                              textAlign: 'center',
                              fontWeight: 600,
                              fontSize: '13px',
                            }}
                          >
                            Break
                          </th>
                          <th
                            style={{
                              padding: '10px 12px',
                              textAlign: 'left',
                              fontWeight: 600,
                              fontSize: '13px',
                            }}
                          >
                            Amount
                          </th>
                          <th
                            style={{
                              padding: '10px 12px',
                              textAlign: 'left',
                              fontWeight: 600,
                              fontSize: '13px',
                            }}
                          >
                            Due Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => (
                          <tr
                            key={row.id}
                            style={{
                              borderBottom: '1px solid #f0f0f0',
                              backgroundColor: row.isBreak ? '#f5f5f5' : 'transparent',
                              opacity: row.isBreak ? 0.6 : 1,
                            }}
                          >
                            <td style={{ padding: '10px 12px' }}>
                              <Input
                                value={row.monthName}
                                disabled
                                style={{ textAlign: 'center', border: 'none' }}
                              />
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <Input
                                value={row.sequenceNo}
                                disabled
                                style={{ textAlign: 'center', border: 'none' }}
                              />
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <Input
                                placeholder="e.g., Monthly Fee"
                                value={row.paymentLabel}
                                disabled={row.isBreak}
                                onChange={(e) => {
                                  setMonthlyPaymentRows((prev) =>
                                    prev.map((r) =>
                                      r.id === row.id ? { ...r, paymentLabel: e.target.value } : r,
                                    ),
                                  );
                                }}
                              />
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              <input
                                type="checkbox"
                                checked={row.isBreak}
                                onChange={(e) =>
                                  handleMonthBreakChange(row.id, e.target.checked)
                                }
                                style={{ transform: 'scale(1.2)' }}
                              />
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <InputNumber
                                style={{ width: '100%' }}
                                min={0}
                                step={0.01}
                                placeholder="0.00"
                                disabled={row.isBreak}
                                value={formatForDisplay(row.amount)}
                                onChange={(value) => {
                                  setMonthlyPaymentRows((prev) =>
                                    prev.map((r) =>
                                      r.id === row.id
                                        ? { ...r, amount: typeof value === 'number' ? value : 0 }
                                        : r,
                                    ),
                                  );
                                }}
                                formatter={(value) =>
                                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                }
                              />
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <DatePicker
                                style={{ width: '100%' }}
                                placeholder="mm/dd/yyyy"
                                disabled={row.isBreak}
                                value={row.dueDate}
                                onChange={(date) => {
                                  setMonthlyPaymentRows((prev) =>
                                    prev.map((r) =>
                                      r.id === row.id ? { ...r, dueDate: date } : r,
                                    ),
                                  );
                                }}
                                status={!row.dueDate && !row.isBreak ? 'error' : undefined}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ));
            })()}
          </div>
        </>
      )}
    </Card>
  );
}

