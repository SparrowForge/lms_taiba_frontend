'use client';

import { CreditCardOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useState, useMemo, useEffect } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useStudents } from '@/hooks/useStudents';

// Your actual API data


export default function PaymentsDashboard() {
  const { user } = useAuth()
  const { loadStudentWithFeeInfo, studentWithFeeInfo } = useStudents()
  const [selectedInstallment, setSelectedInstallment] = useState<number | null>(null);

  useEffect(() => {
    if (user?.student?.id) {
      loadStudentWithFeeInfo(user.student.id);
    }
  }, [loadStudentWithFeeInfo, user?.student?.id]);



  const calculatedData = useMemo(() => {
    const totalPaid = studentWithFeeInfo?.paymentCollections.reduce(
      (sum, payment) => sum + payment.amountPaid,
      0
    );
    const totalDue = studentWithFeeInfo?.feeStructure.totalFees - totalPaid;

    // Find which installments are paid/unpaid
    const installmentStatus: Record<string, string> = {};
    studentWithFeeInfo?.paymentCollections.forEach((payment) => {
      payment.paymentDetails.forEach((detail) => {
        if (detail.balanceAmount === 0) {
          installmentStatus[detail.feeTitle] = 'paid';
        } else if (detail.amountPaid > 0) {
          installmentStatus[detail.feeTitle] = 'partial';
        } else {
          installmentStatus[detail.feeTitle] = 'pending';
        }
      });
    });

    return { totalPaid, totalDue, installmentStatus };
  }, []);

  const formatDate = (date: string) => new Date(date).toLocaleDateString();
  const formatCurrency = (amount: number) =>
    `${studentWithFeeInfo?.feeStructure.currency} ${amount?.toLocaleString()}`;

  return (
    <div className="min-h-screen  p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold  mb-2">
            Course Fees Payment
          </h1>
          <p className="text-lg  ">
            {studentWithFeeInfo?.student.firstName} {studentWithFeeInfo?.student.lastName} • {studentWithFeeInfo?.student.course.name}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Due */}
          <div className=" rounded-lg p-6 shadow-md border ">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold  ">
                Total Due
              </h3>
              <ClockCircleOutlined className="text-2xl text-amber-500" />
            </div>
            <p className="text-3xl font-bold  mb-2">
              {formatCurrency(calculatedData.totalDue)}
            </p>
            <p className="text-sm  dark:text-slate-400">
              Out of {formatCurrency(studentWithFeeInfo?.feeStructure.totalFees)}
            </p>
          </div>

          {/* Total Paid */}
          <div className=" rounded-lg p-6 shadow-md border ">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold  ">
                Total Paid
              </h3>
              <CheckCircleOutlined className="text-2xl text-green-500" />
            </div>
            <p className="text-3xl font-bold  mb-2">
              {formatCurrency(calculatedData.totalPaid)}
            </p>
            <p className="text-sm  dark:text-slate-400">
              {((calculatedData.totalPaid / studentWithFeeInfo?.feeStructure.totalFees) * 100).toFixed(1)}%
              of total fees
            </p>
          </div>

          {/* Upcoming Payment */}
          <div className=" rounded-lg p-6 shadow-md border ">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold  ">
                Next Payment
              </h3>
              <CreditCardOutlined className="text-2xl text-blue-500" />
            </div>
            <p className="text-3xl font-bold  mb-2">
              {formatCurrency(22500)}
            </p>
            <p className="text-sm  dark:text-slate-400">
              Level 2 Fee (Due Mar 31, 2026)
            </p>
          </div>
        </div>

        {/* Payment Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Installment Plans */}
          <div className="lg:col-span-2">
            <div className=" rounded-lg p-6 shadow-md border ">
              <h2 className="text-2xl font-bold  mb-6">
                Installment Schedule
              </h2>
              <div className="space-y-3">
                {studentWithFeeInfo?.feeStructure.installmentPlans.map((plan, idx) => {
                  const status = calculatedData.installmentStatus[plan.paymentLabel] || 'pending';
                  const statusColor =
                    status === 'paid'
                      ? ''
                      : status === 'partial'
                        ? ''
                        : '';

                  const statusText =
                    status === 'paid'
                      ? 'Paid'
                      : status === 'partial'
                        ? 'Partially Paid'
                        : 'Pending';
                  const statusTextColor =
                    status === 'paid'
                      ? ''
                      : status === 'partial'
                        ? ''
                        : ' ';

                  return (
                    <div
                      key={plan.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${statusColor} hover:shadow-md`}
                      onClick={() =>
                        setSelectedInstallment(
                          selectedInstallment === plan.id ? null : plan.id
                        )
                      }
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold ">
                            {plan.paymentLabel}
                          </h3>
                          <p className="text-sm  ">
                            Due: {formatDate(plan.dueDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold ">
                            {formatCurrency(plan.amount)}
                          </p>
                          <p className={`text-xs font-semibold ${statusTextColor}`}>
                            {statusText}
                          </p>
                        </div>
                      </div>
                      {selectedInstallment === plan.id && (
                        <div className="mt-4 pt-4 border-t border-current">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="">Original Amount</p>
                              <p className="font-semibold ">
                                {formatCurrency(plan.amount)}
                              </p>
                            </div>
                            <div>
                              <p className="">Discount</p>
                              <p className="font-semibold ">
                                {formatCurrency(plan.discountAmount)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div>
            <div className=" rounded-lg p-6 shadow-md border ">
              <h2 className="text-xl font-bold  mb-6">
                Payment History
              </h2>
              <div className="space-y-4">
                {studentWithFeeInfo?.paymentCollections.map((payment) => (
                  <div
                    key={payment.id}
                    className="pb-4 border-b  last:border-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold ">
                        {formatCurrency(payment.amountPaid)}
                      </p>
                      <span
                       
                      >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs">
                      {formatDate(payment.paymentDate)}
                    </p>
                    <p className="text-xs  ">
                      {/* Ref: {payment.transactionRef || 'N/A'} */}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
