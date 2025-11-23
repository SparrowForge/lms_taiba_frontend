
import React, { useEffect } from 'react'


import { useAuth } from '@/hooks/useAuth'
import { useFacultySubjects } from '@/hooks/useFacultySubjects'

import { SubjectCollapse } from './SubjectCollapse'
import { IFacultySubject } from '@/types/facultySubject'


const FacultyCourse = () => {
    const {facultySubjects, loadFacultySubjects} = useFacultySubjects()
    const {user} = useAuth()
    useEffect(()=>{
        loadFacultySubjects({page:1, limit:99, facultyId: user?.faculty?.id })
    },[loadFacultySubjects, user])

  const groupBySemesterAndBatch = (data:IFacultySubject[]) => {
    const grouped = {};

    data.forEach(item => {
      const semesterId = item.semesterId;
      const batchId = item.batchId; // can be null

      const key = `${semesterId}-${batchId}`;

      if (!grouped[key]) {
        grouped[key] = {
          semesterId,
          batchId,
          subjects: []
        };
      }

      grouped[key].subjects.push(item);
    });

    return Object.values(grouped);
  };

  const groupedData = groupBySemesterAndBatch(facultySubjects)

  console.log("groupedData",groupedData)


  return (
    <div className="space-y-4">
      <div className='mx-10'>
        <h1 className="text-3xl font-bold mb-8">Faculty Subject </h1>
        <SubjectCollapse data={groupedData} />
      </div>
    </div>
  )
}

export default FacultyCourse
