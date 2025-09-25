import React from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  FaDownload,
  FaFilePdf,
  FaTrophy,
  FaUserCheck,
} from "react-icons/fa";
import { MdOutlineSwitchAccount } from "react-icons/md";
import { AiOutlineBarChart } from "react-icons/ai";
import { IoStatsChartSharp } from "react-icons/io5";

const GradePage: React.FC = () => {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="h-[95vh] overflow-y-auto p-6 bg-gray-50">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Academic Records & Reports | السجلات الأكاديمية والتقارير
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-md flex items-center gap-1">
                <MdOutlineSwitchAccount /> Switch to Parent View | التبديل إلى عرض الوالدين
              </button>
              <select className="border rounded-md px-2 py-1 text-sm">
                <option>English</option>
                <option>العربية</option>
              </select>
              <img
                src="https://i.pravatar.cc/40"
                alt="profile"
                className="w-9 h-9 rounded-full border"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 shadow rounded-lg">
              <p className="text-sm text-gray-500">GPA | المعدل التراكمي</p>
              <h3 className="text-2xl font-bold text-blue-600">3.75</h3>
              <p className="text-green-600 text-sm">↑ Improved from 3.6 last term</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg">
              <p className="text-sm text-gray-500">Attendance | الحضور</p>
              <h3 className="text-2xl font-bold text-green-600">95%</h3>
              <p className="text-green-600 text-sm">Excellent attendance rate</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg">
              <p className="text-sm text-gray-500">Rank | الترتيب</p>
              <h3 className="text-2xl font-bold text-purple-600">5/124</h3>
              <p className="text-sm text-gray-500">Top 5% in Grade 11 | في الصف 11</p>
            </div>
            <div className="bg-white p-4 shadow rounded-lg">
              <p className="text-sm text-gray-500">Reports | التقارير</p>
              <h3 className="text-2xl font-bold text-gray-800">4</h3>
              <button className="mt-2 text-blue-600 text-sm flex items-center gap-1">
                <FaDownload /> Download latest reports
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Subject Grades */}
            <div className="bg-white shadow rounded-lg p-4 md:col-span-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-700">Subject Grades | درجات المواد</h3>
                <div className="flex gap-2">
                  <select className="border rounded-md px-2 py-1 text-sm">
                    <option>First Term | الفصل الأول</option>
                    <option>Second Term | الفصل الثاني</option>
                  </select>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm">
                    Print | طباعة
                  </button>
                </div>
              </div>
              {/* Bar chart placeholder */}
              <div className="h-48 bg-gradient-to-r from-blue-100 to-blue-50 rounded-md flex items-center justify-center text-gray-500 mb-4">
                <AiOutlineBarChart className="text-4xl" />
                <span className="ml-2">[Bar Chart Placeholder]</span>
              </div>
              {/* Grades Table */}
              <table className="w-full text-sm border-t">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Subject | المادة</th>
                    <th className="p-2">Midterm | نصف</th>
                    <th className="p-2">Final | نهائي</th>
                    <th className="p-2">Grade | الدرجة</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-2">Mathematics | الرياضيات</td>
                    <td className="p-2">89%</td>
                    <td className="p-2">94%</td>
                    <td className="p-2 text-blue-600 font-bold">92%</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Physics | الفيزياء</td>
                    <td className="p-2">84%</td>
                    <td className="p-2">92%</td>
                    <td className="p-2 text-blue-600 font-bold">88%</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-2">Chemistry | الكيمياء</td>
                    <td className="p-2">95%</td>
                    <td className="p-2">95%</td>
                    <td className="p-2 text-blue-600 font-bold">95%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Attendance */}
              <div className="bg-white shadow rounded-lg p-4">
                <h3 className="font-bold text-gray-700 mb-3">Attendance | سجل الحضور</h3>
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span>This Month | هذا الشهر</span>
                  <span className="font-bold text-green-600">95%</span>
                </div>
                <div className="flex gap-2 text-xs mb-2">
                  <span className="text-green-600">● Present | حاضر</span>
                  <span className="text-red-500">● Absent | غائب</span>
                  <span className="text-yellow-500">● Late | متأخر</span>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d, i) => (
                    <div key={i} className="text-gray-500">
                      {d}
                    </div>
                  ))}
                  {[1, 2, 3, 4, 5, 6, 7].map((day, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-full ${
                        day === 1 || day === 2 || day === 3
                          ? "bg-green-100 text-green-700"
                          : day === 4
                          ? "bg-red-100 text-red-700"
                          : day === 5
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              {/* Reports & Documents */}
              <div className="bg-white shadow rounded-lg p-4">
                <h3 className="font-bold text-gray-700 mb-3">
                  Reports & Documents | التقارير والمستندات
                </h3>
                <ul className="text-sm space-y-2">
                  <li className="p-2 border rounded-md flex justify-between items-center">
                    <span>Term 1 Report Card (PDF) - Jun 30, 2023</span>
                    <FaDownload className="text-blue-600" />
                  </li>
                  <li className="p-2 border rounded-md flex justify-between items-center">
                    <span>Academic Progress Summary (PDF) - May 15, 2023</span>
                    <FaDownload className="text-blue-600" />
                  </li>
                  <li className="p-2 border rounded-md flex justify-between items-center">
                    <span>Standardized Test Results (PDF) - Apr 20, 2023</span>
                    <FaDownload className="text-blue-600" />
                  </li>
                </ul>
                <button className="w-full mt-3 text-blue-600 text-sm border rounded-md p-2">
                  View All Documents | عرض جميع المستندات
                </button>
              </div>

              {/* Parent View */}
              <div className="bg-white shadow rounded-lg p-4">
                <h3 className="font-bold text-gray-700 mb-3">Parent View | عرض الوالدين</h3>
                <div className="flex items-center gap-3">
                  <img
                    src="https://i.pravatar.cc/40"
                    alt="parent"
                    className="w-9 h-9 rounded-full border"
                  />
                  <div>
                    <p className="font-semibold">Ahmed Mohammed</p>
                    <p className="text-xs text-gray-500">Grade 11</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default GradePage;
