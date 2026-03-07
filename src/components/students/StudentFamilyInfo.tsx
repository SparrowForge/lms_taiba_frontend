'use client'

import {
    UserOutlined,
    HomeOutlined,
    PhoneOutlined,
    MailOutlined,
    TeamOutlined,
    PlusOutlined,
    EyeOutlined,
    DownloadOutlined,
} from '@ant-design/icons'
import { Badge, Button, Card, Empty, List, Select, Space, Tag, Typography } from 'antd'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { useStudentFamilies } from '@/hooks/useStudentFamilies'
import StudentFamilyFormDrawer from '../studentFamilies/StudentFamilyFormDrawer'
import { useLocalization } from '@/hooks/useLocalization'
import { useTranslations } from 'next-intl'
import { LOCALE_KEYS } from '@/constants/localizationKeys'
import { toast } from 'react-toastify'
import FileUpload from '../ui/FileUpload'
import { EntityType, FileCategory, FileType } from '@/enums'

const documentStatusData = [
    { id: 1, title: "nidFrontFather", name: 'Father National ID Card Front', nameAr: 'بطاقة الهوية الوطنية', status: 'verified', bgColor: '#f6ffed' },
    { id: 2, title: "nidBackFather", name: 'Father National ID Card Back', nameAr: 'بطاقة الهوية الوطنية الخلفية', status: 'verified', bgColor: '#f6ffed' },
    { id: 3, title: "nidFrontMother", name: 'Mother National ID Card Front', nameAr: 'بطاقة الهوية الوطنية', status: 'verified', bgColor: '#f6ffed' },
    { id: 4, title: "nidBackMother", name: 'Mother National ID Card Back', nameAr: 'بطاقة الهوية الوطنية الخلفية', status: 'verified', bgColor: '#f6ffed' },
    { id: 5, title: "passportPhotoFather", name: 'Passport Father', nameAr: 'صورة شخصية', status: 'verified', bgColor: '#f6ffed' },
    { id: 6, title: "passportPhotoMother", name: 'Passport Mother', nameAr: 'صورة شخصية', status: 'verified', bgColor: '#f6ffed' },
]

const StudentFamilyInfo = () => {
    const { loadStudentFamilies, studentFamilies, editStudentFamily } = useStudentFamilies()
    const { id } = useParams()
    const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
    const [selectedStudentFamilyId, setSelectedStudentFamilyId] = useState<number | undefined>();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const { t } = useLocalization();
    const [fileId, setFileId] = useState<number | undefined>();
    const [selectedDoc, setSelectedDoc] = useState<string | undefined>();
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
            await editStudentFamily(Number(selectedStudentFamilyId), formData)
        } catch (error) {
            toast.error('Failed to approve student:' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleDrawerSuccess = () => {
        setDrawerVisible(false);
        loadStudentFamilies({ page: 1, limit: 1, studentId: Number(id) });
    };

    useEffect(() => {
        if (id) {
            loadStudentFamilies({
                page: 1,
                limit: 1,
                studentId: Number(id),
            })
        }
    }, [loadStudentFamilies, id])

    const family = studentFamilies?.[0]


    const handleCreateDrawer = () => {
        console.log("object")
        setSelectedStudentFamilyId(undefined);
        setDrawerMode('create');
        setDrawerVisible(true);
    };


    const uploadedDocumentsData = Object.entries(studentFamilies?.[0]?.documentsFiles ?? {}).map(
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
        <>
            {
                !family ? <Card className="rounded-lg ">
                    <Button
                        type="primary"

                        icon={<PlusOutlined />}
                        onClick={handleCreateDrawer}
                        className="flex items-center gap-2 justify-end"
                    >
                        Add Family Information
                    </Button>
                    <p className="text-gray-500 text-center">
                        <Empty description="No family information available." />
                    </p>

                </Card> : <Card
                    className="rounded-lg"
                    title="Family Information"
                   
                >
                    <Typography.Title level={4} className="mb-4">
                        Family Documents Upload Section
                    </Typography.Title>
                    <div className="flex justify-end mb-4">
                        <Button loading={loading} type='primary' onClick={() => handleSubmit()}>
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
                                <Select.Option
                                    key={doc.id}
                                    value={doc.title}     // submit this
                                    label={doc.name}      // show this
                                >
                                    <div className="flex items-center justify-between">
                                        <Typography.Text type="secondary" className="text-xs">
                                            {doc.name}
                                        </Typography.Text>
                                    </div>
                                </Select.Option>
                            ))}
                        </Select>

                        {selectedDoc && (
                            <p style={{ marginTop: "10px" }}>
                                You selected: {documentStatusData.find((d) => d.title === selectedDoc)?.name}
                            </p>
                        )}
                    </div>

                    {/* Upload New Document Section */}
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


                    <div className='flex justify-end mb-4'>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleCreateDrawer}
                            className="flex items-center gap-2 justify-end"
                        >
                            Add Family Information
                        </Button>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <Card
                            title={
                                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                                    <UserOutlined className="text-blue-500" />
                                    Father Information
                                </div>
                            }
                            bordered
                            className="shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <Space direction="vertical" size="small">
                                <span>
                                    <strong>Name:</strong> {family.fatherName || '-'}
                                </span>
                                <span className="flex items-center gap-1 text-gray-600">
                                    <HomeOutlined className="text-gray-400" /> {family.fatherAddress || '-'}
                                </span>
                                <span className="flex items-center gap-1 text-gray-600">
                                    <PhoneOutlined className="text-gray-400" /> {family.fatherPhone || '-'}
                                </span>
                                <span className="flex items-center gap-1 text-gray-600">
                                    <MailOutlined className="text-gray-400" /> {family.fatherEmail || '-'}
                                </span>
                            </Space>
                        </Card>

                        {/* Mother Information */}
                        <Card
                            title={
                                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                                    <UserOutlined className="text-pink-500" />
                                    Mother Information
                                </div>
                            }
                            bordered
                            className="shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <Space direction="vertical" size="small">
                                <span>
                                    <strong>Name:</strong> {family.motherName || '-'}
                                </span>
                                <span className="flex items-center gap-1 text-gray-600">
                                    <PhoneOutlined className="text-gray-400" /> {family.motherPhone || '-'}
                                </span>
                                <span className="flex items-center gap-1 text-gray-600">
                                    <MailOutlined className="text-gray-400" /> {family.motherEmail || '-'}
                                </span>
                            </Space>
                        </Card>

                        {/* Siblings */}
                        <Card
                            title={
                                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                                    <TeamOutlined className="text-green-500" />
                                    Siblings
                                </div>
                            }
                            bordered
                            className="shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <p className="mb-2 text-gray-700">
                                <strong>Total Siblings:</strong> {family.noOfSiblings || 0}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {family.siblingsIds?.length > 0 ? (
                                    family.siblingsIds.map((siblingId: number) => (
                                        <Tag key={siblingId} color="cyan" className="font-medium">
                                            Student ID: {siblingId}
                                        </Tag>
                                    ))
                                ) : (
                                    <span className="text-gray-400">No siblings listed</span>
                                )}
                            </div>
                        </Card>
                    </div>



                </Card>
            }

            <Card style={{ borderRadius: 8 }}>
                <div
                    style={{
                        marginBottom: 80,
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

            <StudentFamilyFormDrawer
                mode={drawerMode}
                studentFamilyId={selectedStudentFamilyId}
                visible={drawerVisible}
                onCancel={() => setDrawerVisible(false)}
                onSuccess={handleDrawerSuccess}
            />
        </>
    )
}

export default StudentFamilyInfo
