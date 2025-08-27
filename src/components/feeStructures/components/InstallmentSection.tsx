import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import { Status } from '@/types/common';
import { PaymentRow } from '../types';
import { IBatch } from '@/types/batch';
import { ISemester } from '@/types/semester';

interface InstallmentSectionProps {
  selectedBatch: IBatch;
  semesters: ISemester[];
  paymentRows: PaymentRow[];
  listStatus: Status;
  totalFees: number;
  onUpdatePaymentRows: (rows: PaymentRow[]) => void;
  getMissingSemesterNumbers: () => string;
}

const InstallmentSection: React.FC<InstallmentSectionProps> = ({
  selectedBatch,
  semesters,
  paymentRows,
  listStatus,
  totalFees,
  onUpdatePaymentRows,
  getMissingSemesterNumbers
}) => {
  if (!selectedBatch) return null;

  return (
    <Card 
      title="Fee Structure Details (Installment)"
      style={{ marginBottom: 16 }}
    >
      {/* Show helpful note when no semesters exist */}
      {semesters.length === 0 && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '16px',
          borderRadius: '6px',
          backgroundColor: '#fff7e6',
          border: '1px solid #ffd591',
          fontSize: '13px'
        }}>
          <p style={{ color: '#d46b08', margin: 0 }}>
            <strong>Note:</strong> This batch is configured for {selectedBatch.course?.durationInSemesters || 0} semesters, but no semester records exist yet. You'll need to create the semester records first to generate fee structure rows.
          </p>
        </div>
      )}
      
      {/* Show warning when some semesters are missing */}
      {semesters.length > 0 && semesters.length < selectedBatch.course?.durationInSemesters && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '16px',
          borderRadius: '6px',
          backgroundColor: '#fff2f0',
          border: '1px solid #ffccc7',
          fontSize: '13px'
        }}>
          <p style={{ color: '#cf1322', margin: 0, marginBottom: '8px' }}>
            <strong>⚠️ Warning:</strong> This batch is configured for {selectedBatch.course?.durationInSemesters || 0} semesters, but only {semesters.length} semester records were found.
          </p>
          <p style={{ color: '#434343', margin: 0, marginBottom: '8px', fontSize: '12px' }}>
            <strong>Missing semesters:</strong> {getMissingSemesterNumbers()}
          </p>
          <p style={{ color: '#666', margin: 0, fontSize: '12px' }}>
            You can proceed with the available semesters, but consider creating the missing ones for a complete fee structure.
          </p>
        </div>
      )}
      
      {/* Show totals summary for installment payments */}
      {paymentRows.length > 0 && (
        <div style={{
          padding: '12px',
          marginBottom: '16px',
          borderRadius: '6px',
          border: '1px solid #e1e4e8'
        }}>
          <Row gutter={16}>
            <Col span={8}>
              <strong>Form Total Fees:</strong> {Number(totalFees || 0).toFixed(2)}
            </Col>
            <Col span={8}>
              <strong>Semester Sum ({paymentRows.length} semesters):</strong> {paymentRows.reduce((sum, row) => sum + row.amount, 0).toFixed(2)}
            </Col>
            <Col span={8}>
              <strong>Difference:</strong> {Math.abs((Number(totalFees || 0) - paymentRows.reduce((sum, row) => sum + row.amount, 0))).toFixed(2)}
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
                    const semesterCount = paymentRows.length;
                    const amountPerSemester = totalFeesNumber / semesterCount;
                    
                    const updatedRows = paymentRows.map(row => ({
                      ...row,
                      amount: amountPerSemester
                    }));
                    onUpdatePaymentRows(updatedRows);
                  }
                }}
                disabled={!totalFees || paymentRows.length === 0}
              >
                Auto-Distribute Total Fees Across {paymentRows.length} Semesters
              </Button>
            </Col>
          </Row>
        </div>
      )}

      {/* Installment rows table would go here */}
      {/* This is a simplified version - you can add the full table logic */}
    </Card>
  );
};

export default InstallmentSection;
