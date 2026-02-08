'use client';

import React, { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import StudentsResult from '@/components/result/StudentsResult';
import { AcademicResultGrade } from '@/components/students/AcademicResultGrade';
import BasicInformation from '@/components/students/BasicInformation';
import ContactInformation from '@/components/students/ContactInformation';
import EnrollmentInformation from '@/components/students/EnrollmentInformation';
import PaymentDetails from '@/components/students/PaymentDetails';
import PreviousAcademicHistory from '@/components/students/PreviousAcademicHistory';
import ProfileTabs from '@/components/students/ProfileTabs';
import StudentAttendanceRecord from '@/components/students/StudentAttendanceRecord';
import { useCreateStudentDetailsConfig } from '@/components/students/studentConfig';
import StudentFamilyInfo from '@/components/students/StudentFamilyInfo';
import StudentHeader from '@/components/students/StudentHeader';
import { EntityDetails } from '@/components/ui/EntityDetails';
import { EntityDetailsConfig } from '@/components/ui/EntityDetailsContent';

import { useLocalization } from '@/hooks/useLocalization';
import { useStudents } from '@/hooks/useStudents';

import { IStudent } from '@/types/student';

import { ActivityTimeline } from '../../../../components/students/ActivityTimeline';
import StudentAcademicRecord from '@/components/students/StudentAcademicRecord';
import StudentDocuments from '@/components/students/StudentDocuments';


export default function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [activeTab, setActiveTab] = useState('personal')
  const { selectedStudent, detailsStatus, loadStudent } = useStudents();
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.STUDENT, { defaultValue: 'Student' });

  const resolvedParams = React.use(params);
  const studentId = parseInt(resolvedParams.id);

  // Load student if not already loaded
  useEffect(() => {
    //getStudentById(studentId);
    loadStudent(studentId);
  }, [loadStudent, studentId]);

  console.log("Student", selectedStudent)

  const config = useCreateStudentDetailsConfig(
    selectedStudent,
    detailsStatus.status === Status.LOADING,
    detailsStatus.status === Status.FAILED
      ? detailsStatus.message || t(LOCALE_KEYS.FAILED_NAME, { name: entityName })
      : null,
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (<>
          <BasicInformation student={selectedStudent} />
          <ContactInformation student={selectedStudent} />
          {/* <AcademicInformation student={selectedStudent} /> */}
          <EnrollmentInformation student={selectedStudent} />
        </>)
      case 'guardian':
        return <StudentFamilyInfo />
      case 'previous-data':
        return <PreviousAcademicHistory />
      case 'documents':
        return <StudentDocuments />
      case 'academic':
        return <StudentAcademicRecord />
      case 'fees':
        return <PaymentDetails />
      case 'grades':
        return <AcademicResultGrade />
      case 'attendance':
        return <StudentAttendanceRecord />
      case 'activity':
        return <ActivityTimeline />


    }
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        {/* <EntityDetails config={config as EntityDetailsConfig<IStudent>} /> */}
        <div className="py-6 px-4 h-screen overflow-y-auto" >
          <div className=" mx-auto">
            <StudentHeader student={selectedStudent} />

            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab}>
              {renderTabContent()}
            </ProfileTabs>

            <div className="mt-8 ">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
