"use client"
import { Col, Row } from 'antd';



import { useRole } from '@/hooks/useRole';

import TeacherLayout from './TeacherLayout';
import StudentLayout from './StudentLayout';

const LayoutDashboard = () => {
    const role = useRole();
    return (
        <div>
            <Row
                gutter={[24, 24]}
                className="pl-6"
                style={{ width: "100%", minWidth: 0, height: "100%" }}
            >
                {role === "teacher" ? (
                 
                       <TeacherLayout/>
              
                ) : (
                  
                       <StudentLayout/> 
         
                )}</Row>
        </div>
    );
};

export default LayoutDashboard;