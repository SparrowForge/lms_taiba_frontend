import { CheckCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card } from 'antd'
import React from 'react'

const RetakeSchedules = () => {
    return (
        <div>
            <Card style={{ borderRadius: '8px' }}>


                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <CheckCircleOutlined style={{ fontSize: '48px', color: '#999', marginBottom: '16px', display: 'block' }} />
                    <p style={{ color: '#666', fontSize: '14px' }}>No failed students for this subject</p>
                    <Button type="primary"
                        icon={<PlusOutlined />}>
                        Schedule First Retake
                    </Button>
                </div>
            </Card>
        </div>
    )
}

export default RetakeSchedules
