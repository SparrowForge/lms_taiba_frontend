import { Card } from 'antd';

import CourseDashboard from './CourseDashboard';
import MyCoursesSection from './MyCoursesSection';
import UpperHeaderSection from './UpperHeaderSection';

const CoursesStudenLayout = () => {
  return (
    <div className="md:mx-10 my-6">
      <UpperHeaderSection />
      <Card>
        <CourseDashboard />
        <MyCoursesSection />
      </Card>
    </div>
  );
};

export default CoursesStudenLayout;
