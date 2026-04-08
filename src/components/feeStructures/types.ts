import type { Dayjs } from 'dayjs';

export interface PaymentRow {
  id: string;
  semester: string | number;
  sequenceNo: number;
  paymentLabel: string;
  durationMonths: number;
  amount: number;
  dueDate: Dayjs | null;
}

export interface MonthlyPaymentRow {
  id: string;
  semesterId: number;
  semesterName: string;
  monthNumber: number;
  monthName: string;
  sequenceNo: number;
  paymentLabel: string;
  amount: number;
  dueDate: Dayjs | null;
  startDate: Dayjs;
  endDate: Dayjs;
}
