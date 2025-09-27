import { Card } from 'antd';
import React from 'react';
import ColumnGraph from '../dashboard/dashboardui/graphs/ColumnGraph';
import { useLocalization } from '@/hooks/useLocalization';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import SubjectSection from './SubjectSection';

const data = [
  { xdata: 'Mathematics', ydata: 92, color: "#4AA3F0" },   // blue
  { xdata: 'Physics', ydata: 88, color: "#9B5CFD" },       // purple
  { xdata: 'Chemistry', ydata: 95, color: "#57C7BC" },     // teal
  { xdata: 'English', ydata: 77, color: "#FFA94D" },       // orange
  { xdata: 'Computer Science', ydata: 96, color: "#7FC77D" }, // green
  { xdata: 'Biology', ydata: 83, color: "#F064A4" },       // pink
];

const SubjectGrades = () => {
    const { t } = useLocalization();

    return (
        <Card className="p-4" style={{ }}>
            <h2 className="text-xl font-semibold mb-3">{t(LOCALE_KEYS.SUBJECT_GRADE)}</h2>
            <div style={{ height: 360 }}>
                <ColumnGraph data={data} />
            </div>
            <div className=''>
                  <SubjectSection/>
            </div>
          
        </Card>
    );
};

export default SubjectGrades;
