import {  Card, Col, Empty, Row, Spin,  } from 'antd'
import React, { useEffect, } from 'react'

import { LOCALE_KEYS } from '@/constants/localizationKeys'
import { Status } from '@/enums'

import { useAuth } from '@/hooks/useAuth'
import { useExamResults } from '@/hooks/useExamResults'
import { useLocalization } from '@/hooks/useLocalization'

const ExamResultByStudent = () => {
    const { t } = useLocalization()
    const { loadExamResults, examResults, listStatus } = useExamResults()
    const { user } = useAuth()

    useEffect(() => {
        if(user?.student?.id){
            loadExamResults({ page: 1, limit: 99, studentId: user?.student?.id, })
        }
    }, [ loadExamResults, user?.student?.id]);


    return (
        <Card className="rounded-xl shadow-sm mb-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{t(LOCALE_KEYS.EXAM_RESULT)}</h2>
            </div>

            {/* States */}
            {listStatus.status === Status.LOADING && (
                <div className="flex justify-center items-center h-40">
                    <Spin />
                </div>
            )}

            {listStatus.status === Status.SUCCESS && examResults?.length === 0 && (
                <Empty description="NO RESULT FOUND ON THIS SUBJECT" />
            )}

            {/* Assignment Cards */}
            {listStatus.status === Status.SUCCESS && examResults?.length > 0 && (
                <Row className="gap-4" style={{ maxHeight: '420px' }}>
                    {examResults?.map((item) => (
                        <Col key={item?.id}>
                            <Card
                                className="shadow-md rounded-xl border"
                                title={
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">{item?.exam?.name}</span>
  
                                    </div>
                                }
                            >
                                <div className="space-y-2 text-sm">
                                    {/* <p>
                                        <span className="font-medium">Subject:</span>{" "}
                                        {item?.subject?.name}
                                    </p> */}
                                    <p>
                                        <span className="font-medium">Exam Type:</span> {item?.exam?.questionType}
                                    </p>
                                    <p>
                                        <span className="font-medium">Marks:</span> {item?.exam?.marks}
                                    </p>
                                    
                                    <p>
                                        <span className="font-medium">Obtained:</span>{" "}
                                        {item?.marksObtained}
                                    </p>
                                    {
                                        examResults && <p>
                                        <span className="font-medium">Room:</span>{" "}
                                        {examResults?.length}
                                    </p>
                                    }
                                    
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}



        </Card>
    )
}

export default ExamResultByStudent
