import React from 'react'

import { UserType } from '@/enums/user-type.enum'

import { useAuth } from '@/hooks/useAuth'

import ExamResultByStudent from './ExamResultByStudent'

const ExamResultIndividualSubject = () => {
    const {user} = useAuth()
  return (
    <div>
      {user?.type === UserType.FACULTY && <>Faculty See Result</>}
      {user?.type === UserType.STUDENT && <ExamResultByStudent/>}
    </div>
  )
}

export default ExamResultIndividualSubject
