'use client'

import { UploadOutlined, EyeOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { Card, Row, Col, Progress, Badge, Button, List, Space, Form, Typography, } from 'antd'
import FileUpload from '../ui/FileUpload'
import { EntityType, FileCategory, FileType } from '@/enums'
import { useLocalization } from '@/hooks/useLocalization'
import { useTranslations } from 'next-intl'
import { LOCALE_KEYS } from '@/constants/localizationKeys'
import { useEffect, useState } from 'react'
import { useStudents } from '@/hooks/useStudents'
import { Select } from 'antd';
import { useParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { useFiles } from '@/hooks/useFiles'

const { Option } = Select;


// Mock data for document status
const documentStatusData = [
    { id: 1, title: "nidFront", name: 'National ID Card Front', nameAr: 'بطاقة الهوية الوطنية', status: 'verified', bgColor: '#f6ffed' },
    { id: 2, title: "nidBack", name: 'National ID Card Back', nameAr: 'بطاقة الهوية الوطنية الخلفية', status: 'verified', bgColor: '#f6ffed' },
    { id: 3, title: "passportPhoto", name: 'Passport', nameAr: 'صورة شخصية', status: 'verified', bgColor: '#f6ffed' },
    { id: 4, title: "highSchoolCertificate", name: 'High School Certificate', nameAr: 'شهادة الثانوية العامة', status: 'missing', bgColor: '#f5f5f5' },
    { id: 5, title: "medicalFitnessReport", name: 'Medical Fitness Report', nameAr: 'تقرير اللياقة الطبية', status: 'verified', bgColor: '#f6ffed' },
    { id: 6, title: "birthCertificate", name: 'Birth Certificate', nameAr: 'شهادة الميلاد', status: 'missing', bgColor: '#f5f5f5' },
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

    const { selectedStudent, loadStudent } = useStudents()

    const { t } = useLocalization();
    const translate = useTranslations();
    const entityName = t(LOCALE_KEYS.COURSE_ASSIGNMENT, { defaultValue: 'Course Assignment' });
    const [fileId, setFileId] = useState<number | undefined>();
    const { editStudent } = useStudents()
    const [selectedDoc, setSelectedDoc] = useState<string | undefined>();
    const { id } = useParams()
    const [loading, setLoading] = useState(false);

    const handleChange = (value: string) => {
        setSelectedDoc(value);
    };

    const handleSubmit = async () => {
        if (!selectedDoc || !fileId) {
            toast.error('Please select a document and upload a file before submitting.');
            return;
        }
        const formData = {
            documents: {
                [selectedDoc]: fileId
            }
        }
        console.log(formData)
        setLoading(true);
        try {
            await editStudent(Number(id), formData)
            toast.success('Student document added successfully!');
        } catch (error) {
            toast.error('Failed to approve student:' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadStudent(Number(id))
        }
    }, [id, loadStudent])

    const uploadedDocumentsData = Object.entries(selectedStudent?.documentsFiles ?? {}).map(
        ([key, value]) => ({
            id: value.id,
            key,
            name: key,
            nameAr: '',
            fileName: value.originalName,
            uploadDate: new Date(value.uploadedAt).toLocaleDateString(),
            mimeType: value.mimeType,
            filePath: value.filePath
        })
    )



    return (
        <div style={{ marginBottom: "100px" }}>

            <Card style={{ marginBottom: '24px', borderRadius: '8px' }}>

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

            </Card>
            <div className="flex justify-end mb-4">
                <Button type='primary' onClick={() => handleSubmit()}>
                    Submit
                </Button>
            </div>

            <div>
                <Select
                    placeholder="Select a document"
                    value={selectedDoc}
                    onChange={handleChange}
                    className="w-full"
                    size="large"
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    filterOption={(input, option) =>
                        (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {documentStatusData.map((doc) => (
                        <Option
                            key={doc.id}
                            value={doc.title}     // submit this
                            label={doc.name}      // show this
                        >
                            <div className="flex items-center justify-between">
                                <Typography.Text type="secondary" className="text-xs">
                                    {doc.name}
                                </Typography.Text>
                            </div>
                        </Option>
                    ))}
                </Select>

                {selectedDoc && (
                    <p style={{ marginTop: "10px" }}>
                        You selected: {documentStatusData.find((d) => d.title === selectedDoc)?.name}
                    </p>
                )}
            </div>


            <Card style={{ marginBottom: '24px', borderRadius: '8px', borderStyle: 'dashed' }}>
                <FileUpload
                    fileType={FileType.DOCUMENT}
                    fileCategory={FileCategory.ACADEMIC}
                    entityType={EntityType.STUDENT_DOCUMENT}
                    entityId={1}
                    accept="*/*"
                    maxSize={50}
                    allowAllFiles={true}
                    onChange={(id) => {
                        console.log('Uploaded file ID:', id); // <-- here you get the ID
                        setFileId(id); // store it in parent state if needed
                    }}
                />
            </Card>

            <Card style={{ borderRadius: 8 }}>
                <div
                    style={{
                        marginBottom: 24,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
                        Uploaded Documents
                    </h3>

                    <span style={{ color: '#999', fontSize: 12 }}>
                        {uploadedDocumentsData.length} documents
                    </span>
                </div>

                <List
                    dataSource={uploadedDocumentsData}
                    renderItem={(item) => (
                        <List.Item key={item.id} style={{ paddingLeft: 0, paddingRight: 0 }}>
                            <List.Item.Meta
                                avatar={
                                    item.mimeType.startsWith('image/') ? (
                                        <img
                                            src={item.filePath} // actual image
                                            alt={item.fileName}
                                            style={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 4,
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 4,
                                                backgroundColor: '#e6f2ff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 22
                                            }}
                                        >
                                            📄
                                        </div>
                                    )
                                }
                                title={
                                    <div>
                                        <Space>
                                            <strong>{item.name}</strong>
                                            <Badge color="#ff5722" text="✓ Verified" />
                                        </Space>

                                        <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>
                                            {item.nameAr}
                                        </div>
                                    </div>
                                }
                                description={
                                    <div style={{ fontSize: 12, color: '#999' }}>
                                        <div>{item.fileName}</div>
                                        <div>Uploaded: {item.uploadDate}</div>
                                    </div>
                                }
                            />

                            <Space>
                                {/* View button */}
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<EyeOutlined />}
                                    onClick={() => window.open(item.filePath, '_blank')}
                                />

                                {/* Download button */}
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<DownloadOutlined />}
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = item.filePath;
                                        link.download = item.fileName;
                                        link.click();
                                    }}
                                />
                            </Space>
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    )
}
