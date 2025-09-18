'use client';

import { Button } from 'antd';
import React from 'react';
import { FaFilePdf, FaFilePowerpoint, FaFileWord, FaPlayCircle } from 'react-icons/fa';

interface Material {
  id: number;
  title: string;
  type: 'pdf' | 'pptx' | 'mp4' | 'docx';
  size: string;
  uploaded: string;
}

const materials: Material[] = [
  {
    id: 1,
    title: 'Algebra Fundamentals - Chapter 3',
    type: 'pdf',
    size: '2.3 MB',
    uploaded: 'Aug 18, 2023',
  },
  {
    id: 2,
    title: 'Quadratic Equations - Lecture Slides',
    type: 'pptx',
    size: '5.7 MB',
    uploaded: 'Aug 15, 2023',
  },
  {
    id: 3,
    title: 'Problem Solving Techniques - Video Tutorial',
    type: 'mp4',
    size: '45:12',
    uploaded: 'Aug 10, 2023',
  },
  {
    id: 4,
    title: 'Practice Problems Set 4',
    type: 'docx',
    size: '1.1 MB',
    uploaded: 'Aug 5, 2023',
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FaFilePdf className="text-red-500 text-lg" />;
    case 'pptx':
      return <FaFilePowerpoint className="text-orange-500 text-lg" />;
    case 'mp4':
      return <FaPlayCircle className="text-purple-500 text-lg" />;
    case 'docx':
      return <FaFileWord className="text-green-500 text-lg" />;
    default:
      return null;
  }
};

const CourseDashboard: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-xl p-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Mathematics | <span className="text-gray-500">الرياضيات</span>
        </h2>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
            Join Live Class | الانضمام للفصل المباشر
          </Button>
          <Button className="text-sm">
            Download Materials | تحميل المواد
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mt-5 text-center">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600">Completed Units | الوحدات المكتملة</p>
          <p className="text-lg font-bold">8/12</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600">Average Grade | متوسط الدرجة</p>
          <p className="text-lg font-bold text-green-600">86%</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600">Time Spent | الوقت المستغرق</p>
          <p className="text-lg font-bold">28h 15m</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-600">Next Exam | الاختبار القادم</p>
          <p className="text-lg font-bold text-blue-600">Aug 29</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b mt-6 text-sm font-medium">
        <button className="text-blue-600 border-b-2 border-blue-600 pb-2">
          Materials | المواد
        </button>
        <button className="pb-2">Assignments | الواجبات</button>
        <button className="pb-2">Grades | الدرجات</button>
        <button className="pb-2">Discussion | المناقشة</button>
      </div>

      {/* Materials List */}
      <div className="mt-4 space-y-3">
        {materials.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-gray-50 rounded-lg p-3 hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              {getIcon(item.type)}
              <div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-gray-500">
                  {item.size} • Uploaded {item.uploaded}
                </p>
              </div>
            </div>
            <button className="text-blue-500 hover:text-blue-700">
              {item.type === 'mp4' ? '▶' : '⬇'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDashboard;
