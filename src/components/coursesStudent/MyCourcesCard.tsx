'use client';

import { ClockCircleOutlined } from '@ant-design/icons';
import { Carousel } from 'antd';
import React, { useEffect } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';
import { useSubjects } from '@/hooks/useSubjects';

const MyCourcesCard = () => {
  const { t } = useLocalization();
  const { subjects, listStatus, loadSubjects } = useSubjects();

  // Load subjects when component mounts
  useEffect(() => {
    loadSubjects({ page: 1, limit: 10 });
  }, [loadSubjects]);

  // Example fallback colors (rotate if subjects don’t have color)
  const colors = ['#2563eb', '#9333ea', '#059669', '#dc2626', '#d97706'];

  if (listStatus.status === 'LOADING') {
    return <p className="text-center">Loading subjects...</p>;
  }

  if (!subjects || subjects.length === 0) {
    return <p className="text-center">No subjects found.</p>;
  }

  return (
    <div className="w-full mx-auto">
      <Carousel
        dots
        arrows
        infinite
        slidesToShow={3}
        slidesToScroll={1}
        autoplay
        responsive={[
          {
            breakpoint: 1024, // md
            settings: { slidesToShow: 2 },
          },
          {
            breakpoint: 640, // sm
            settings: { slidesToShow: 1 },
          },
        ]}
      >
        {subjects.map((course, index) => {
          const color = (course as any).color || colors[index % colors.length]; // fallback if no color in API
          return (
            <div key={course.id} className="px-2">
              <div
                className="rounded-lg shadow p-4 relative bg-white"
                style={{ borderTop: `8px solid ${color}` }}
              >
                {/* Top row */}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-xl">{course.name}</h3>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full uppercase">
                    {course.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  {course.grade || 'Grade 11'} - {course.level || 'Advanced'}
                </p>
                <p className="text-sm font-medium mb-2">{course.teacher || 'Unknown Teacher'}</p>

                {/* Progress */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{t(LOCALE_KEYS.PROGRESS)}</span>
                    <span>{course.progress ?? 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className="h-2 rounded"
                      style={{
                        width: `${course.progress ?? 0}%`,
                        backgroundColor: color,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Units and Time */}
                <div className="flex justify-between items-center text-sm mt-2">
                  <span>{course.units ?? 0} Units</span>
                  <span className="flex items-center gap-1">
                    <ClockCircleOutlined style={{ fontSize: 14 }} /> {course.time || 'N/A'}
                  </span>
                </div>

                {/* Button */}
                <button className="mt-3 w-full text-sm text-blue-600 border border-blue-600 rounded py-1.5 hover:bg-blue-50">
                  {t(LOCALE_KEYS.OPEN_SUBJECT)}
                </button>
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default MyCourcesCard;
