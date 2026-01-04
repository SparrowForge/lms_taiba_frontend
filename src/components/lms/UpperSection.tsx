'use client';
import {
  ClockCircleOutlined,
  CommentOutlined,
  FileTextOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useEffect, useState } from 'react';

import { UserType } from '@/enums/user-type.enum';

import { useAuth } from '@/hooks/useAuth';
import { useCourseMaterials } from '@/hooks/useCourseMaterials';


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

const UpperSection = () => {

  const { courseMaterials, loadCourseMaterials } = useCourseMaterials()
  const { user } = useAuth()

  // Fetch materials on mount
  useEffect(() => {
    if (user?.type === UserType.FACULTY) {
      loadCourseMaterials({ page: 1, limit: 99, facultyId: user?.faculty?.id })
    } else if (user?.type === UserType.STUDENT) {
      loadCourseMaterials({ page: 1, limit: 99, courseId: user?.student?.courseId,  batchId: user?.student?.batchId })
    } else if (user?.type === UserType.ADMIN) {
      loadCourseMaterials({ page: 1, limit: 99 })
    }
  }, [loadCourseMaterials, user?.faculty?.id, user?.student?.batchId, user?.student?.courseId, user?.type]);

  const studentInitial = [
    {
      id: '1',
      title: 'My Courses',
      localTitle: 'دوراتي',
      number: '-',
      icon: <ReadOutlined />,
      color: '#1F4BCA',
      iconColor: '#1F4BCA',
    },
    {
      id: '2',
      title: 'Course Materials',
      localTitle: 'المحتوى',
      number: courseMaterials.length,
      icon: <FileTextOutlined />,
      color: '#d97706',
      iconColor: '#d97706',
    },
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

export default UpperSection;
