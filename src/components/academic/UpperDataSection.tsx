'use client';
import {
  FileDoneOutlined,
  PieChartOutlined,
  ScheduleOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useState } from 'react';

import { useLocalization } from '@/hooks/useLocalization';

import LeftBorderCard from '../dashboard/dashboardui/cards/LeftBorderCard';

// 🔹 Sortable wrapper for each card
const SortableCard = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const UpperDataSection = () => {
  const { t } = useLocalization();

  const studentInitial = [
    {
      id: '1',
      title: 'Weekly Classes',
      localTitle: 'الحصص الأسبوعية',
      number: '-',
      icon: <ScheduleOutlined />,
      color: '#1F4BCA',
      iconColor: '#1F4BCA',
    },
    {
      id: '2',
      title: 'Attendance Rate',
      localTitle: 'معدل الحضور',
      number: '-',
      icon: <SolutionOutlined />,
      color: '#d97706',
      iconColor: '#d97706',
    },
    // {
    //   id: '3',
    //   title: 'Upcoming Exams',
    //   localTitle: 'الإختبارات القادمة',
    //   number: '-',
    //   icon: <FileDoneOutlined />,
    //   color: '#10b981',
    //   iconColor: '#10b981',
    // },
    // {
    //   id: '4',
    //   title: 'Average Grade',
    //   localTitle: 'متوسط الدرجات',
    //   number: '-',
    //   icon: <PieChartOutlined />,
    //   color: '#7c3aed',
    //   iconColor: '#7c3aed',
    // },
  ];

  // 🔹 State for cards
  const [dataTeacher, setDataTeacher] = useState(studentInitial);

  // 🔹 DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // drag starts after 5px
    }),
  );

  // 🔹 Handle drag & drop reorder
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setDataTeacher((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  return (
    <div className="md:mx-6">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={dataTeacher.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4 md:my-6">
            {dataTeacher.map((item) => (
              <SortableCard key={item.id} id={item.id}>
                <LeftBorderCard {...item} />
              </SortableCard>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default UpperDataSection;
