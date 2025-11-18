'use client';

import { FileDoneOutlined, FundProjectionScreenOutlined, ProfileOutlined } from '@ant-design/icons';
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { UserType } from '@/enums/user-type.enum';

import { useAuth } from '@/hooks/useAuth';
import { useLocalization } from '@/hooks/useLocalization';

import WelcomeSection from './WelcomeSection';
import LeftBorderCard from '../dashboardui/cards/LeftBorderCard';
import UpBorderCard from '../dashboardui/cards/UpBorderCard';

// ===== SORTABLE WRAPPER =====
const SortableCard = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

// ===== MAIN COMPONENT =====
const DashboardStartSection = () => {
  const { user } = useAuth();
  const { t } = useLocalization();

  const teacherInitial = [
    {
      id: 'classes',
      title: t(LOCALE_KEYS.TEACHER_CLASSES_TITLE, { defaultValue: "Today's Classes" }),
      subTitle: t(LOCALE_KEYS.TEACHER_CLASSES_SUBTITLE, {
        defaultValue: 'Next: Web Development at 11:30 AM',
      }),
      number: 3,
      icon: <FundProjectionScreenOutlined />,
      color: '#1F4BCA',
      iconColor: '#1F4BCA',
    },
    {
      id: 'assignments',
      title: t(LOCALE_KEYS.TEACHER_ASSIGNMENTS_TITLE, { defaultValue: 'Pending Assignments' }),
      subTitle: t(LOCALE_KEYS.TEACHER_ASSIGNMENTS_SUBTITLE, {
        defaultValue: '4 need grading, 4 due this week',
      }),
      number: 8,
      icon: <ProfileOutlined />,
      color: '#e5e7eb',
      iconColor: '#000000',
    },
    {
      id: 'evaluations',
      title: t(LOCALE_KEYS.TEACHER_EVALUATIONS_TITLE, { defaultValue: 'Student Evaluations' }),
      subTitle: t(LOCALE_KEYS.TEACHER_EVALUATIONS_SUBTITLE, {
        defaultValue: 'Mid-term evaluations due Friday',
      }),
      number: 12,
      icon: <FileDoneOutlined />,
      color: '#1dbc87',
      iconColor: '#1dbc87',
    },
  ];

  const studentInitial = [
    {
      id: 'courses1',
      title: t(LOCALE_KEYS.STUDENT_COURSES_TITLE, { defaultValue: 'Active Courses' }),
      subTitle: t(LOCALE_KEYS.STUDENT_COURSES_SUBTITLE, {
        defaultValue: '2 courses have upcoming deadlines',
      }),
      number: '6',
      icon: <FundProjectionScreenOutlined />,
      color: '#1F4BCA',
      iconColor: '#1F4BCA',
    },
    {
      id: 'courses2',
      title: t(LOCALE_KEYS.STUDENT_COURSES_TITLE, { defaultValue: 'Active Courses' }),
      subTitle: t(LOCALE_KEYS.STUDENT_COURSES_SUBTITLE, {
        defaultValue: '2 courses have upcoming deadlines',
      }),
      number: '4',
      icon: <FundProjectionScreenOutlined />,
      color: '#d97706',
      iconColor: '#d97706',
    },
    {
      id: 'courses3',
      title: t(LOCALE_KEYS.STUDENT_COURSES_TITLE, { defaultValue: 'Active Courses' }),
      subTitle: t(LOCALE_KEYS.STUDENT_COURSES_SUBTITLE, {
        defaultValue: '2 courses have upcoming deadlines',
      }),
      number: '92%',
      icon: <FundProjectionScreenOutlined />,
      color: '#10b981',
      iconColor: '#10b981',
    },
    {
      id: 'courses4',
      title: t(LOCALE_KEYS.STUDENT_COURSES_TITLE, { defaultValue: 'Active Courses' }),
      subTitle: t(LOCALE_KEYS.STUDENT_COURSES_SUBTITLE, {
        defaultValue: '2 courses have upcoming deadlines',
      }),
      number: '3.7',
      icon: <FundProjectionScreenOutlined />,
      color: '#7c3aed',
      iconColor: '#7c3aed',
    },
  ];

  const [dataTeacher, setDataTeacher] = useState(teacherInitial);
  const [dataStudent, setDataStudent] = useState(studentInitial);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: any, type: 'teacher' | 'student') => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      if (type === 'teacher') {
        const oldIndex = dataTeacher.findIndex((item) => item.id === active.id);
        const newIndex = dataTeacher.findIndex((item) => item.id === over.id);
        setDataTeacher((items) => arrayMove(items, oldIndex, newIndex));
      } else {
        const oldIndex = dataStudent.findIndex((item) => item.id === active.id);
        const newIndex = dataStudent.findIndex((item) => item.id === over.id);
        setDataStudent((items) => arrayMove(items, oldIndex, newIndex));
      }
    }
  };

  return (
    <div>
      <WelcomeSection />

      {user?.type === UserType.FACULTY ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(e) => handleDragEnd(e, 'teacher')}
        >
          <SortableContext
            items={dataTeacher.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 m-6">
              {dataTeacher.map((item) => (
                <SortableCard key={item.id} id={item.id}>
                  <UpBorderCard {...item} />
                </SortableCard>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : user?.type === UserType.STUDENT ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(e) => handleDragEnd(e, 'student')}
        >
          <SortableContext
            items={dataStudent.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 m-6">
              {dataStudent.map((item) => (
                <SortableCard key={item.id} id={item.id}>
                  <LeftBorderCard {...item} localTitle={item.title} />
                </SortableCard>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div />
      )}
    </div>
  );
};

export default DashboardStartSection;
