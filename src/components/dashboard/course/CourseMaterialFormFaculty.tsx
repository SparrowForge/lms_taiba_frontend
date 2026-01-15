'use client';

import {Button, Col, Form, Input, Row, Select, Space, Switch} from 'antd';
import {useParams, useRouter, useSearchParams} from 'next/navigation';
import React, {useEffect, useMemo, useState} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {ACCESS_LEVEL_TYPE_OPTIONS, EntityType, FileCategory, FileType, MATERIAL_TYPE_OPTIONS, Status,} from '@/enums';

import FormLayoutFull from '@/components/layout/FormLayoutFull';
import FileUpload from '@/components/ui/FileUpload';
import { StatusSelect } from '@/components/ui/StatusSelect';

import { useAttendances } from '@/hooks/useAttendances';
import {useBatches} from '@/hooks/useBatches';
import {useCourseMaterials} from '@/hooks/useCourseMaterials';
import {useCourses} from '@/hooks/useCourses';
import {useFaculties} from '@/hooks/useFaculties';
import {useLocalization} from '@/hooks/useLocalization';
import {useSemesters} from '@/hooks/useSemesters';
import {useSemesterSubjects} from '@/hooks/useSemesterSubjects';

import {ICourseMaterial, ICourseMaterialCreate, ICourseMaterialUpdate,} from '@/types/courseMaterial';
import { getErrorMessage } from '@/types/errors';
import CourseAssignmentsFacultyDetails from '@/components/courseAssignments/CourseAssignmentFacultyDetails';
import { useSubjects } from '@/hooks/useSubjects';
import { useAuth } from '@/hooks/useAuth';



const { TextArea } = Input;

interface CourseMaterialFormProps {
  mode: 'create' | 'edit';
  courseMaterialId?: number;
  initialValues?: Partial<ICourseMaterialCreate | ICourseMaterialUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
  classNo:number
}

const CourseMaterialFacultyForm: React.FC<CourseMaterialFormProps> = ({
  mode,
  courseMaterialId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
  classNo
}) => {
        const {id} = useParams()
        const searchParams = useSearchParams();
        const semesterId = searchParams.get("semesterId");
        const batchId = searchParams.get("batchId");
        const { t } = useLocalization();
        const entityName = t(LOCALE_KEYS.COURSE_MATERIAL, { defaultValue: 'Course Material' });
        const router = useRouter();
        const [form] = Form.useForm();
        const { createCourseMaterial, editCourseMaterial, actionStatus } = useCourseMaterials();
        const {loadSubject, selectedSubject} = useSubjects()
        const {loadCourse, selectedCourse} = useCourses()
        const {loadBatch, selectedBatch} = useBatches()
        const {loadSemester, selectedSemester} = useSemesters()
        const {user} = useAuth()

        useEffect(()=>{
            loadSubject(parseInt(id))
        },[loadSubject,id])
  
        useEffect(()=>{
          loadCourse(selectedSubject?.courseId)
          loadBatch(batchId)
          loadSemester(semesterId)
        },[batchId, loadBatch, loadCourse, loadSemester, selectedSubject?.courseId, semesterId])


    useEffect(() => {
        if (mode === 'create') {
        form.resetFields();
        }
    }, [mode, form]);



    const handleSubmit = async (values: Partial<ICourseMaterial>) => {
        const mValues ={
          ...values,
          courseId: selectedSubject?.courseId,
          subjectId: id,
          semesterId: semesterId,
          batchId: batchId,
          facultyId: user?.faculty.id,
          classNo
      }
        try {
        if (mode === 'create') {
            await createCourseMaterial(mValues as ICourseMaterialCreate);
            toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
            if (onSuccess) {
            onSuccess();
            } else {
            router.push('/course-materials');
            }
        } else if (mode === 'edit' && courseMaterialId) {
            await editCourseMaterial(courseMaterialId, mValues as ICourseMaterialUpdate);
            toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
            if (onSuccess) {
            onSuccess();
            } else {
            router.push(`/course-materials/${courseMaterialId}`);
            }
        }
        } catch (error: unknown) {
        let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
            name: entityName,
            defaultValue: `Failed to ${mode} ${entityName.toLowerCase()}`,
        });

        // Try to extract error message from API response
        if (error && typeof error === 'object' && 'response' in error) {
            const apiError = error as { response?: { data?: { message?: string } } };
            if (apiError.response?.data?.message) {
            errorMessage = apiError.response.data.message;
            }
        } else {
            // Use the helper function for other error types
            errorMessage = getErrorMessage(error);
        }

        toast.error(errorMessage);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
        onCancel();
        } else {
        router.back();
        }
    };



    const getSubmitText = () =>
        mode === 'create'
        ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
        : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });

    const formContent = (
        <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={mode === 'edit' ? initialValues : undefined}
        >
        <Row gutter={[32, 16]}>
            {/* Left Column - Cascading Dropdowns */}
            
            {/* Right Column - Material Details */}
            <Col xs={24} lg={24}>
            <CourseAssignmentsFacultyDetails
                    semester={selectedSemester} 
                    batch={selectedBatch} 
                    course={selectedCourse} 
                    faculty={user} 
                    subject={selectedSubject}
                    classNo={classNo}
                />
            <Form.Item
                name="title"
                label={t(LOCALE_KEYS.TITLE)}
                rules={[
                {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.TITLE) }),
                },
                ]}
            >
                <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.TITLE) })} />
            </Form.Item>

            <Form.Item
                name="description"
                label={t(LOCALE_KEYS.DESCRIPTION)}
                rules={[
                {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DESCRIPTION) }),
                },
                ]}
            >
                <TextArea
                rows={4}
                placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.DESCRIPTION) })}
                />
            </Form.Item>

            <Form.Item
                name="type"
                label={t(LOCALE_KEYS.TYPE)}
                rules={[
                {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.TYPE) }),
                },
                ]}
            >
                <StatusSelect options={MATERIAL_TYPE_OPTIONS} />
            </Form.Item>

            <Form.Item name="fileId" label={t(LOCALE_KEYS.FILE)}>
                <FileUpload
                fileType={FileType.DOCUMENT}
                fileCategory={FileCategory.ACADEMIC}
                entityType={EntityType.COURSE_MATERIAL}
                entityId={courseMaterialId}
                accept="*/*"
                maxSize={50}
                allowAllFiles={true}
                />
            </Form.Item>

            <Form.Item
                name="isDownloadable"
                label={t(LOCALE_KEYS.IS_DOWNLOADABLE)}
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>

            <Form.Item
                name="accessLevel"
                label={t(LOCALE_KEYS.ACCESS_LEVEL)}
                rules={[
                {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ACCESS_LEVEL) }),
                },
                ]}
            >
                <StatusSelect options={ACCESS_LEVEL_TYPE_OPTIONS} />
            </Form.Item>
            </Col>
        </Row>

        {/* Action Buttons */}
        <Form.Item>
            <Space>
            <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
                {getSubmitText()}
            </Button>
            <Button onClick={handleCancel}>{t(LOCALE_KEYS.CANCEL)}</Button>
            </Space>
        </Form.Item>
        </Form>
    );

  if (embedded) {
    return formContent;
  }

  return <FormLayoutFull>{formContent}</FormLayoutFull>;
};

export default CourseMaterialFacultyForm;
