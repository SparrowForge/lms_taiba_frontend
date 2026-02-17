import { CheckCircleOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import React from 'react'

const FailedStudents = () => {
    return (
        <div>
            <Card style={{ borderRadius: '8px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600 }}>
                    Failed Students - Mathematics I
                </h3>
                <p style={{ margin: '0 0 32px 0', color: '#666', fontSize: '13px' }}>
                    Students who failed this subject and are eligible for retake exams
                </p>

                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <CheckCircleOutlined style={{ fontSize: '48px', color: '#999', marginBottom: '16px', display: 'block' }} />
                    <p style={{ color: '#666', fontSize: '14px' }}>No failed students for this subject</p>
                </div>
            </Card>
        </div>
    )
}

export default FailedStudents
