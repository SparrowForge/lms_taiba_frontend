"use client"

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import AcademicResult from '@/components/students/AcademicResult';
import { ActivityTimeline } from '@/components/students/ActivityTimeline';
import BasicInformation from '@/components/students/BasicInformation';
import ContactInformation from '@/components/students/ContactInformation';
import EnrollmentInformation from '@/components/students/EnrollmentInformation';
import PaymentDetails from '@/components/students/PaymentDetails';
import PreviousAcademicHistory from '@/components/students/PreviousAcademicHistory';
import ProfileTabs from '@/components/students/ProfileTabs';
import StudentAcademicRecord from '@/components/students/StudentAcademicRecord';
import StudentAttendanceRecord from '@/components/students/StudentAttendanceRecord';
import StudentDocuments from '@/components/students/StudentDocuments';
import StudentFamilyInfo from '@/components/students/StudentFamilyInfo';
import StudentHeader from '@/components/students/StudentHeader';
import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';
import { useAuth } from '@/hooks/useAuth';
import { useLocalization } from '@/hooks/useLocalization';
import { useStudents } from '@/hooks/useStudents';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';

const ProfileMainDashboard = () => {
  const [activeTab, setActiveTab] = useState('personal')
  const { selectedStudent, detailsStatus, loadStudent, actionStatus } = useStudents();
  const { t } = useLocalization();

  const { user } = useAuth()

  // Load student if not already loaded
  useEffect(() => {
    if (user?.student?.id) {
      loadStudent(user.student.id);
    }
  }, [loadStudent, user?.student?.id]);




  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (<>
          <BasicInformation student={selectedStudent} />
          <ContactInformation student={selectedStudent} />
          <EnrollmentInformation student={selectedStudent} />
        </>)
      case 'guardian':
        return <StudentFamilyInfo />
      case 'previous-data':
        return <PreviousAcademicHistory />
      case 'documents':
        return <StudentDocuments />
      case 'academic':
        return <StudentAcademicRecord studentInfo={selectedStudent} />
      case 'fees':
        return <PaymentDetails />
      case 'grades':
        return <AcademicResult />
      case 'attendance':
        return <StudentAttendanceRecord />
      case 'activity':
        return <ActivityTimeline />
    }
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        {
          actionStatus.status === Status.LOADING ? <div className=""><Spin size="large" /></div> : <div className="py-6 px-4 h-screen overflow-y-auto" >
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
        }
      </MainLayout>
    </ProtectedRoute>
  );
};

export default ProfileMainDashboard;
