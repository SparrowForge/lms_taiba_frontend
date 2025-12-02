import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, } from 'react'

import { useExams } from '@/hooks/useExams'
import { IQuestionSetCreate } from '@/types/questionSet'
import { Button, Card, Col, Form, Input, Row, Select, Space, Switch } from 'antd'
import { LOCALE_KEYS } from '@/constants/localizationKeys'
import FormLayout from '../layout/FormLayout'
import { StatusSelectFormItem } from '../ui/StatusSelect'
import { ENTITY_STATUS_OPTIONS } from '@/constants/statusOptions'
import { useLocalization } from '@/hooks/useLocalization'
import { Status } from '@/enums'
import { FormState } from './QuestionSet'

interface QuestionSetFormProps {
  formData: FormState;
  setFormData: React.Dispatch<React.SetStateAction<FormState>>;
  changeHandler: (key: keyof FormState, value: string) => void;
}


const QuestionSetForm: React.FC<QuestionSetFormProps> = ({ formData, changeHandler }) => {
    const { t } = useLocalization();
    const searchParams = useSearchParams()
    const examId = searchParams.get("examId")
    const { selectedExam, loadExam } = useExams()


    useEffect(() => {
        if (examId) {
            loadExam(Number(examId))
        }
    }, [loadExam, examId])

    return (
        <div>
            <Card style={{ margin: '8px' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={6}>
                        <p className='font-semibold text-md'>Course: {selectedExam?.course.name}</p>
                    </Col>
                    <Col xs={24} sm={6}>
                        <p className='font-semibold text-md'>Batch: {selectedExam?.batch.name}</p>
                    </Col>
                    <Col xs={24} sm={6}>
                        <p className='font-semibold text-md'>Semester: {selectedExam?.semester.name}</p>
                    </Col>
                    <Col xs={24} sm={6}>
                        <p className='font-semibold text-md'>Subject: {selectedExam?.subject.name}</p>
                    </Col>
                    <Col xs={24} sm={6}>
                        <p className='font-semibold text-md'>Exam: {selectedExam?.examType.name}</p>
                    </Col>
                </Row>

                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col xs={24} sm={8}>
                            <Form.Item label="Name">
                                <Input
                                    placeholder={LOCALE_KEYS.ENTER_NAME}
                                    value={formData.name}
                                    onChange={(e) => changeHandler("name", e.target.value)}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={8}>
                            <Form.Item label="Description">
                                <Input
                                    placeholder={LOCALE_KEYS.ENTER_DESCRIPTION}
                                    value={formData.descriptionText}
                                    onChange={(e) =>
                                        changeHandler("descriptionText", e.target.value)
                                    }
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={8}>
                            <Form.Item label="Status">
                                <Select
                                    placeholder={LOCALE_KEYS.STATUS}   
                                    value={formData.status}
                                    onChange={(value) => changeHandler("status", value)}
                                    options={[
                                        { label: "Active", value: "active" },
                                        { label: "Inactive", value: "inactive" },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

            </Card>
        </div>
    )

}

export default QuestionSetForm
