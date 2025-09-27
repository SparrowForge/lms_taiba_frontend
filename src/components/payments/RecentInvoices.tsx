'use client';
import React from 'react';
import { FaDownload } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { AiFillCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { Card } from 'antd';

type Invoice = {
  id: string;
  title: string;
  date: string;
  amount: string;
  status: {
    value: "paid" | "unpaid";
    label: { en: string; ar: string };
  };
};

const invoices: Invoice[] = [
  {
    id: "INV-2023-09",
    title: "September Tuition",
    date: "Aug 15, 2023",
    amount: "SAR 4,500",
    status: {
      value: "unpaid",
      label: {
        en: "Unpaid",
        ar: "غير مدفوع"
      }
    }
  },
  {
    id: "INV-2023-08",
    title: "August Tuition",
    date: "Jul 15, 2023",
    amount: "SAR 4,500",
    status: {
      value: "paid",
      label: {
        en: "Paid",
        ar: "مدفوع"
      }
    }
  },
  {
    id: "INV-2023-07",
    title: "Lab Equipment Fee",
    date: "Jun 30, 2023",
    amount: "SAR 1,200",
    status: {
      value: "paid",
      label: {
        en: "Paid",
        ar: "مدفوع"
      }
    }
  }
];

// choose language dynamically (could come from context, locale, props, etc.)
const currentLang: "en" | "ar" = "en";

const RecentInvoices = () => {
  return (
    <Card className="bg-white shadow rounded-lg md:col-span-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-700">Recent Invoices | الفواتير الحديثة</h3>
        <div className="flex gap-2">
          <button className="bg-gray-100 px-3 py-1 rounded-md text-sm">Filter | تصفية</button>
          <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1">
            <FaDownload /> Download All | تنزيل الكل
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm">
            <th className="p-2">#</th>
            <th className="p-2">Invoice | الفاتورة</th>
            <th className="p-2">Date | التاريخ</th>
            <th className="p-2">Amount | المبلغ</th>
            <th className="p-2">Status | الحالة</th>
            <th className="p-2">Actions | الإجراءات</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-t">
              <td className="p-2">{invoice.id}</td>
              <td className="p-2">{invoice.title}</td>
              <td className="p-2">{invoice.date}</td>
              <td className="p-2">{invoice.amount}</td>
              <td
                className={`p-2 flex items-center gap-1 ${
                  invoice.status.value === "paid" ? "text-green-600" : "text-red-500"
                }`}
              >
                {invoice.status.value === "paid" ? (
                  <>
                    <AiFillCheckCircle /> {invoice.status.label[currentLang]}
                  </>
                ) : (
                  <>
                    <AiOutlineCloseCircle /> {invoice.status.label[currentLang]}
                  </>
                )}
              </td>
              <td className="p-2 flex gap-2 text-blue-600">
                <FaDownload /> <MdOutlinePayment />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default RecentInvoices;
