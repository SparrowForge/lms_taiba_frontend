'use client';

import { Button, DatePicker, Drawer, Form, Input } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status, StudentStatus } from '@/enums';

import { useLocalization } from '@/hooks/useLocalization';
import { useStudents } from '@/hooks/useStudents';


interface ApproveStudentDrawerProps {
  studentId?: number;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ApproveStudentDrawer: React.FC<ApproveStudentDrawerProps> = ({
  studentId,
  visible,
  onClose,
  onSuccess,
}) => {
  const { t } = useLocalization();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { editStudent, students, actionStatus } = useStudents();



  const handleSubmit = async (values:any) => {
    try {
        setLoading(true);
    const formData = {
        ...values,
        status: StudentStatus.ACTIVE 
        };
        // console.log(formData)

        await  editStudent(studentId!,  formData )
        onSuccess();
    } catch (error) {
      console.error('Failed to approve student:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleClose = () => {
    
    const student = students.find((s) => s.id === studentId);
    if (!student || !student.id) {
      form.resetFields();
    }
    onClose();
  };

  // Prefill card no, registration no, and admission date when drawer opens and student has them
  useEffect(() => {
    if (visible && studentId) {
      const student = students.find((s) => s.id === studentId);
      if (student) {
        const values: {
          cardNo?: string;
          registrationNo?: string;
          admissionDate?: ReturnType<typeof dayjs>;
        } = {};
        if (student.cardNo?.trim()) values.cardNo = student.cardNo.trim();
        if (student.registrationNo?.trim()) values.registrationNo = student.registrationNo.trim();
        if (student.admissionDate) {
          const date = dayjs(student.admissionDate);
          if (date.isValid()) values.admissionDate = date;
        }
        if (Object.keys(values).length > 0) {
          form.setFieldsValue(values);
        }
      }
    }
  }, [visible, studentId, students, form]);

  // Clear form and selection when drawer closes
  useEffect(() => {
    if (!visible) {
      const student = students.find((s) => s.id === studentId);
      if (!student || !student.id) {
        form.resetFields();
      }
    }
  }, [visible, form, students, studentId]);

  const handleCancel = () => {
    handleClose();
  };



  return (
    <Drawer
      key={studentId} // Force remount when studentId changes
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {t(LOCALE_KEYS.APPROVE, { defaultValue: 'Approve Student' })}
        </div>
      }
      width={600}
      open={visible}
      onClose={handleClose}
      
    >
      <Form 
        onFinish={handleSubmit}
        form={form}
        layout="vertical">
        <Form.Item
            name="cardNo"
            label={t(LOCALE_KEYS.CARD_NO, { defaultValue: 'Card No' })}
            rules={[
            {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.CARD_NO) }),
            },
            ]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            name="registrationNo"
            label={t(LOCALE_KEYS.REGISTRATION_NO, { defaultValue: 'Registration No' })}
            rules={[
            {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.REGISTRATION_NO) }),
            },
            ]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            name="admissionDate"
            label={t(LOCALE_KEYS.ADMISSION_DATE, { defaultValue: 'Admission Date' })}
            rules={[
            {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ADMISSION_DATE) }),
            },
            ]}
        >
            <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
                <div className="flex justify-end space-x-2 gap-2">
                  <Button onClick={handleCancel}>
                    {t(LOCALE_KEYS.CANCEL, { defaultValue: 'Cancel' })}
                  </Button>
                  <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
                    {loading ? 'Approving..' : ' Approve'}
                  </Button>
                </div>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ApproveStudentDrawer;
