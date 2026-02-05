'use client';

import { Button, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useLocalization } from '@/hooks/useLocalization';
import { useStudentFamilies } from '@/hooks/useStudentFamilies';
import { useStudents } from '@/hooks/useStudents';

import { getErrorMessage } from '@/types/errors';
import { IStudentFamilyCreate, IStudentFamilyUpdate } from '@/types/studentFamily';

import FormLayout from '../layout/FormLayout';
import QuickAddRouteButton from '../ui/QuickAddRouteButton';

interface StudentFamilyFormForStudentProps {
    mode: 'create' | 'edit';
    studentFamilyId?: any;
    initialValues?: Partial<IStudentFamilyCreate | IStudentFamilyUpdate>;
    onSuccess?: () => void;
    onCancel?: () => void;
    embedded?: boolean;
}

const StudentFamilyFormForStudent: React.FC<StudentFamilyFormForStudentProps> = ({
    mode,
    studentFamilyId,
    initialValues,
    onSuccess,
    onCancel,
    embedded = false,
}) => {
    const { t } = useLocalization();
    const entityName = t(LOCALE_KEYS.STUDENT_FAMILY, { defaultValue: 'Student Family' });
    const router = useRouter();
    const [form] = Form.useForm();
    const { createStudentFamily, editStudentFamily, actionStatus } = useStudentFamilies();
    const { students, loadStudents } = useStudents();

     useEffect(() => {
        loadStudents({ page: 1, limit: 1000 });
    }, [loadStudents]);


    useEffect(() => {
        if (mode === 'create') {
            form.resetFields();
        }
    }, [mode, form]);

    



    const handleSubmit = async (values: Partial<IStudentFamilyCreate | IStudentFamilyUpdate>) => {
        try {
            const payload = { ...values, studentId: Number(studentFamilyId) };
            if (mode === 'create') {
                await createStudentFamily(payload as IStudentFamilyCreate);
                toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
                if (onSuccess) {
                    onSuccess();
                }
            } else if (mode === 'edit' && studentFamilyId) {
                await editStudentFamily(studentFamilyId, payload as IStudentFamilyUpdate);
                toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.push(`/student-families/${studentFamilyId}`);
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
            initialValues={mode === 'edit' ? initialValues : undefined}
            onFinish={handleSubmit}
            disabled={actionStatus.status === Status.LOADING}
        >


            <Form.Item
                name="fatherName"
                label={t(LOCALE_KEYS.FATHER_NAME)}
                rules={[
                    {
                        required: true,
                        message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.FATHER_NAME) }),
                    },
                ]}
            >
                <Input
                    placeholder={t(LOCALE_KEYS.ENTER_FATHER_NAME, { defaultValue: 'Enter father name' })}
                />
            </Form.Item>

            <Form.Item
                name="fatherAddress"
                label={t(LOCALE_KEYS.FATHER_ADDRESS)}
                rules={[
                    {
                        required: true,
                        message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.FATHER_ADDRESS) }),
                    },
                ]}
            >
                <Input.TextArea
                    rows={3}
                    placeholder={t(LOCALE_KEYS.ENTER_FATHER_ADDRESS, {
                        defaultValue: 'Enter father address',
                    })}
                />
            </Form.Item>

            <Form.Item
                name="fatherPhone"
                label={t(LOCALE_KEYS.FATHER_PHONE)}
                rules={[
                    {
                        required: true,
                        message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.FATHER_PHONE) }),
                    },
                ]}
            >
                <Input
                    placeholder={t(LOCALE_KEYS.ENTER_FATHER_PHONE, { defaultValue: 'Enter father phone' })}
                />
            </Form.Item>

            <Form.Item
                name="fatherEmail"
                label={t(LOCALE_KEYS.FATHER_EMAIL)}
                rules={[
                    {
                        required: true,
                        message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.FATHER_EMAIL) }),
                    },
                    {
                        type: 'email',
                        message: t(LOCALE_KEYS.PLEASE_ENTER_VALID_EMAIL, {
                            defaultValue: 'Please enter a valid email',
                        }),
                    },
                ]}
            >
                <Input
                    placeholder={t(LOCALE_KEYS.ENTER_FATHER_EMAIL, { defaultValue: 'Enter father email' })}
                />
            </Form.Item>

            <Form.Item
                name="motherName"
                label={t(LOCALE_KEYS.MOTHER_NAME)}
                rules={[
                    {
                        required: true,
                        message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.MOTHER_NAME) }),
                    },
                ]}
            >
                <Input
                    placeholder={t(LOCALE_KEYS.ENTER_MOTHER_NAME, { defaultValue: 'Enter mother name' })}
                />
            </Form.Item>

            <Form.Item
                name="motherPhone"
                label={t(LOCALE_KEYS.MOTHER_PHONE)}
                rules={[
                    {
                        required: true,
                        message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.MOTHER_PHONE) }),
                    },
                ]}
            >
                <Input
                    placeholder={t(LOCALE_KEYS.ENTER_MOTHER_PHONE, { defaultValue: 'Enter mother phone' })}
                />
            </Form.Item>

            <Form.Item
                name="motherEmail"
                label={t(LOCALE_KEYS.MOTHER_EMAIL)}
                rules={[
                    {
                        required: true,
                        message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.MOTHER_EMAIL) }),
                    },
                    {
                        type: 'email',
                        message: t(LOCALE_KEYS.PLEASE_ENTER_VALID_EMAIL, {
                            defaultValue: 'Please enter a valid email',
                        }),
                    },
                ]}
            >
                <Input
                    placeholder={t(LOCALE_KEYS.ENTER_MOTHER_EMAIL, { defaultValue: 'Enter mother email' })}
                />
            </Form.Item>

            <Form.Item
                name="noOfSiblings"
                label={t(LOCALE_KEYS.NO_OF_SIBLINGS)}
                rules={[
                    {
                        required: true,
                        message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.NO_OF_SIBLINGS) }),
                    },
                ]}
            >
                <InputNumber
                    placeholder={t(LOCALE_KEYS.ENTER_NO_OF_SIBLINGS, {
                        defaultValue: 'Enter number of siblings',
                    })}
                    min={0}
                    style={{ width: '100%' }}
                />
            </Form.Item>

            <Form.Item name="siblingsIds" label={t(LOCALE_KEYS.SIBLINGS_IDS)}>
                <Select
                    mode="multiple"
                    placeholder={t(LOCALE_KEYS.SELECT_SIBLINGS, { defaultValue: 'Select siblings' })}
                    options={students.map((student) => ({
                        label: student.firstName + ' ' + student.lastName,
                        value: student.id,
                    }))}
                />
            </Form.Item>

            <Form.Item>
                <Space>
                    <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
                        {getSubmitText()}
                    </Button>
                    <Button onClick={handleCancel} disabled={actionStatus.status === Status.LOADING}>
                        {t(LOCALE_KEYS.CANCEL)}
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );

    return embedded ? formContent : <FormLayout>{formContent}</FormLayout>;
};

export default StudentFamilyFormForStudent;
