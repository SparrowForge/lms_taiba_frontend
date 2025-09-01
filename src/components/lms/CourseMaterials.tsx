"use client";
import { LOCALE_KEYS } from "@/constants/localizationKeys";
import LeftBorderCard from "../dashboard/dashboardui/cards/LeftBorderCard";
import { useLocalization } from "@/hooks/useLocalization";
import { FundProjectionScreenOutlined } from "@ant-design/icons";
import React, { useState } from "react";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// 🔹 Sortable wrapper for each card
const SortableCard = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const CourseMaterials = () => {
  const { t } = useLocalization();

  const studentInitial = [
    {
      id: "courses1",
      title: t(LOCALE_KEYS.STUDENT_COURSES_TITLE, { defaultValue: "Active Courses" }),
      subTitle: t(LOCALE_KEYS.STUDENT_COURSES_SUBTITLE, { defaultValue: "2 courses have upcoming deadlines" }),
      number: "6",
      icon: <FundProjectionScreenOutlined />,
      color: "#1F4BCA",
      iconColor: "#1F4BCA"
    },
    {
      id: "courses2",
      title: t(LOCALE_KEYS.STUDENT_COURSES_TITLE, { defaultValue: "Active Courses" }),
      subTitle: t(LOCALE_KEYS.STUDENT_COURSES_SUBTITLE, { defaultValue: "2 courses have upcoming deadlines" }),
      number: "4",
      icon: <FundProjectionScreenOutlined />,
      color: "#d97706",
      iconColor: "#d97706"
    },
    {
      id: "courses3",
      title: t(LOCALE_KEYS.STUDENT_COURSES_TITLE, { defaultValue: "Active Courses" }),
      subTitle: t(LOCALE_KEYS.STUDENT_COURSES_SUBTITLE, { defaultValue: "2 courses have upcoming deadlines" }),
      number: "92%",
      icon: <FundProjectionScreenOutlined />,
      color: "#10b981",
      iconColor: "#10b981"
    },
    {
      id: "courses4",
      title: t(LOCALE_KEYS.STUDENT_COURSES_TITLE, { defaultValue: "Active Courses" }),
      subTitle: t(LOCALE_KEYS.STUDENT_COURSES_SUBTITLE, { defaultValue: "2 courses have upcoming deadlines" }),
      number: "3.7",
      icon: <FundProjectionScreenOutlined />,
      color: "#7c3aed",
      iconColor: "#7c3aed"
    },
  ];

  // 🔹 State for cards
  const [dataTeacher, setDataTeacher] = useState(studentInitial);

  // 🔹 DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // drag starts after 5px
    })
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
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={dataTeacher.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-6 md:m-6">
            {dataTeacher.map((item) => (   // ✅ use state, not initial
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

export default CourseMaterials;
