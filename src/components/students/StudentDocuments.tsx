'use client'

import { UploadOutlined, EyeOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { Card, Row, Col, Progress, Badge, Button, List, Space, } from 'antd'
import FileUpload from '../ui/FileUpload'


// Mock data for document status
const documentStatusData = [
    { id: 1, name: 'National ID Card', nameAr: 'بطاقة الهوية الوطنية', status: 'verified', bgColor: '#f6ffed' },
    { id: 2, name: 'Passport Photo', nameAr: 'صورة شخصية', status: 'verified', bgColor: '#f6ffed' },
    { id: 3, name: 'High School Certificate', nameAr: 'شهادة الثانوية العامة', status: 'missing', bgColor: '#f5f5f5' },
    { id: 4, name: 'Medical Fitness Report', nameAr: 'تقرير اللياقة الطبية', status: 'verified', bgColor: '#f6ffed' },
    { id: 5, name: 'Guardian ID', nameAr: 'هوية ولي الأمر', status: 'pending', bgColor: '#fffbe6' },
    { id: 6, name: 'Birth Certificate', nameAr: 'شهادة الميلاد', status: 'missing', bgColor: '#f5f5f5' },
]

// Mock data for uploaded documents
const uploadedDocumentsData = [
    {
        id: 1,
        name: 'National ID Card',
        nameAr: 'بطاقة الهوية الوطنية',
        fileName: 'national_id_front.pdf',
        status: 'verified',
        uploadDate: '15 Aug 2024',
        expiryDate: '15 May 2029',
    },
    {
        id: 2,
        name: 'Passport Photo',
        nameAr: 'صورة شخصية',
        fileName: 'student_photo.jpg',
        status: 'verified',
        uploadDate: '15 Aug 2024',
    },
]

const getStatusIcon = (status: string) => {
    if (status === 'verified') return '✓'
    if (status === 'pending') return '◐'
    if (status === 'missing') return '○'
    return null
}

const getStatusColor = (status: string) => {
    if (status === 'verified') return '#52c41a'
    if (status === 'pending') return '#faad14'
    if (status === 'missing') return '#999'
    return '#999'
}

export default function StudentDocuments() {
    const verifiedCount = documentStatusData.filter(d => d.status === 'verified').length
    const pendingCount = documentStatusData.filter(d => d.status === 'pending').length
    const missingCount = documentStatusData.filter(d => d.status === 'missing').length
    const completionPercentage = Math.round((verifiedCount / documentStatusData.length) * 100)

    return (
        <div style={{ marginBottom: "100px" }}>
            {/* Document Completion Status Card */}
            <Card style={{ marginBottom: '24px', borderRadius: '8px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0' }}>Document Completion Status</h2>
                    <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>
                        {verifiedCount} of {documentStatusData.length} required documents uploaded
                    </p>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '24px' }}>
                    <Progress percent={completionPercentage} strokeColor="#ff5722" status="active" />
                </div>

                {/* Document Status Grid */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    {documentStatusData.map(doc => (
                        <Col span={8} key={doc.id}>
                            <Card
                                style={{
                                    backgroundColor: doc.bgColor,
                                    border: '1px solid #d9d9d9',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                }}
                                hoverable
                            >
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                backgroundColor: getStatusColor(doc.status),
                                                color: 'white',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {getStatusIcon(doc.status)}
                                        </span>
                                        <span style={{ fontWeight: 500 }}>{doc.name}</span>
                                    </div>
                                    <div style={{ textAlign: 'right', color: '#666', fontSize: '12px' }}>{doc.nameAr}</div>
                                </Space>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Status Summary */}
                <Space size={32}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#52c41a', fontSize: '16px' }}>✓</span>
                        <span style={{ color: '#666' }}>
                            <strong>{verifiedCount}</strong> Verified
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#faad14', fontSize: '16px' }}>◐</span>
                        <span style={{ color: '#666' }}>
                            <strong>{pendingCount}</strong> Pending
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#999', fontSize: '16px' }}>○</span>
                        <span style={{ color: '#666' }}>
                            <strong>{missingCount}</strong> Missing
                        </span>
                    </div>
                </Space>
            </Card>

            {/* Upload New Document Section */}
            <Card style={{ marginBottom: '24px', borderRadius: '8px', borderStyle: 'dashed' }}>
                <FileUpload
                    // fileType={FileType.DOCUMENT}
                    // fileCategory={FileCategory.ACADEMIC}
                    // entityType={EntityType.COURSE_MATERIAL}
                    // entityId={courseMaterialId}
                    accept="*/*"
                    maxSize={50}
                    allowAllFiles={true}
                />
            </Card>

            {/* Uploaded Documents Section */}
            <Card style={{ borderRadius: '8px', }}>
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Uploaded Documents</h3>
                    <span style={{ color: '#999', fontSize: '12px' }}>{uploadedDocumentsData.length} documents</span>
                </div>

                <List
                    dataSource={uploadedDocumentsData}
                    renderItem={item => (
                        <List.Item key={item.id} style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <List.Item.Meta
                                avatar={
                                    <div
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '4px',
                                            backgroundColor: item.id === 1 ? '#e6f2ff' : '#ffe7e6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '24px',
                                        }}
                                    >
                                        {item.id === 1 ? '📄' : '🖼️'}
                                    </div>
                                }
                                title={
                                    <div>
                                        <Space>
                                            <strong>{item.name}</strong>
                                            <Badge color="#ff5722" text="✓ Verified" />
                                        </Space>
                                        <div style={{ color: '#666', fontSize: '12px', marginTop: '4px' }}>{item.nameAr}</div>
                                    </div>
                                }
                                description={
                                    <div style={{ fontSize: '12px', color: '#999' }}>
                                        <div>{item.fileName}</div>
                                        <div>
                                            Uploaded: {item.uploadDate}
                                            {item.expiryDate && ` • Expires: ${item.expiryDate}`}
                                        </div>
                                    </div>
                                }
                            />
                            <Space>
                                <Button type="text" size="small" icon={<EyeOutlined />} />
                                <Button type="text" size="small" icon={<DownloadOutlined />} />
                                <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                            </Space>
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    )
}
