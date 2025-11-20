import React, { useEffect, useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Radio, Timeline } from 'antd';
import { useAttendances } from '@/hooks/useAttendances';

const CourseTimeline: React.FC = () => {
  const [mode, setMode] = useState<'left' | 'alternate' | 'right'>('left');
  const {attendances,loadAttendances} = useAttendances()
  

  useEffect(()=>{
    loadAttendances({page:1, limit:99})
  },[loadAttendances])

  const onChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  };

  console.log("attendances", attendances)

  return (
    <>
      <Radio.Group
        onChange={onChange}
        value={mode}
        style={{
          marginBottom: 20,
        }}
      >
       
      </Radio.Group>
      <Timeline
        mode={mode}
        items={[
          {
            label: '2015-09-01',
            children: 'Create a services',
          },
          {
            label: '2015-09-01 09:12:11',
            children: 'Solve initial network problems',
          },
          {
            children: 'Technical testing',
          },
          {
            label: '2015-09-01 09:12:11',
            children: 'Network problems being solved',
          },
        ]}
      />
    </>
  );
};

export default CourseTimeline;