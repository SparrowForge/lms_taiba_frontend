'use client';

import {Button, Form, Input, Select, Space} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect, useMemo, useState} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {ENTITY_STATUS_OPTIONS} from '@/constants/statusOptions';
import {Status} from '@/enums';
import {DomainOptions, UserType} from '@/enums/user-type.enum';

import {useFaculties} from '@/hooks/useFaculties';
import {useLocalization} from '@/hooks/useLocalization';
import {useStudents} from '@/hooks/useStudents';
import {useUsers} from '@/hooks/useUsers';

import {getErrorMessage} from '@/types/errors';
import {IDomainInfo, IUserCreate, IUserUpdate} from '@/types/user';

import FormLayout from '../layout/FormLayout';
import {StatusSelectFormItem} from '../ui/StatusSelect';
import { useRoles } from '@/hooks/useRoles';

interface UserFormProps {
  mode: 'create' | 'edit';
  userId?: number;
  initialValues?: Partial<IUserCreate | IUserUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean; // If true, don't show own styling (for use in drawer/modal)
}

const UserForm: React.FC<UserFormProps> = ({
  mode,
  userId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.USER, { defaultValue: 'User' });
  const router = useRouter();
  const [form] = Form.useForm();
  const { addUser, editUser, actionStatus, domains, loadDomains } = useUsers();
  const { faculties, loadFacultiesWithoutUser } = useFaculties();
  const { students, loadStudentsWithoutUser } = useStudents();
  const {roles, loadRoles} = useRoles()
   

  // State for profile selection
  const [selectedType, setSelectedType] = React.useState<UserType | undefined>();
  const [selectedFacultyId, setSelectedFacultyId] = React.useState<number | undefined>();
  const [selectedStudentId, setSelectedStudentId] = React.useState<number | undefined>();
  const [selectedEmailDomain, setSelectedEmailDomain] = useState('')
  const [defaultDomain, setDefaultDomain] = useState('')

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
    }
  }, [mode, form]);

  // Load faculties and students without user accounts when component mounts
  useEffect(() => {
    loadFacultiesWithoutUser();
    loadStudentsWithoutUser();
  }, [loadFacultiesWithoutUser, loadStudentsWithoutUser]);

  useEffect(()=>{
    loadRoles({page:1, limit:99})
  },[loadRoles])

  useEffect(()=>{
    loadDomains()
  },[loadDomains])


  useEffect(()=>{
    const dDomain = domains?.items?.find((d: IDomainInfo) => d.isDefault)?.externalId;
    setDefaultDomain(dDomain)
    if (selectedEmailDomain) {
      form.setFieldsValue({
        email: `${selectedEmailDomain.replace(/\s+/g, "").toLowerCase()}@${dDomain}`
      });
    }
  },[domains, selectedEmailDomain, form])

  console.log(defaultDomain)
  // Handle type change
  const handleTypeChange = (type: UserType) => {
    setSelectedType(type);
    setSelectedFacultyId(undefined);
    setSelectedStudentId(undefined);
    form.setFieldsValue({ facultyId: undefined, studentId: undefined, name: '', email: '' });
  };

  const handleDomainChange = (domain:any) => {
    if (selectedEmailDomain) {
      form.setFieldsValue({
        email: `${selectedEmailDomain.replace(/\s+/g, "").toLowerCase()}@${domain}`
      });
    }
};


  // Handle faculty selection
  const handleFacultyChange = (facultyId: number) => {
    setSelectedFacultyId(facultyId);
    const faculty = faculties.find((f) => f.id === facultyId);
    setSelectedEmailDomain(faculty.fullName)
    if (faculty) {
      form.setFieldsValue({
        name: faculty.fullName,
        // email: faculty.email,
      });
    }
  };

  // Handle student selection
  const handleStudentChange = (studentId: number) => {
    setSelectedStudentId(studentId);
    const student = students.find((s) => s.id === studentId);
    console.log("student name", student)
    setSelectedEmailDomain(student?.firstName)
    if (student) {
      form.setFieldsValue({
        name: student.firstName + ' ' + (student.middleName ?? '') + ' ' + student.lastName,
        // email: student.profile?.email,
      });
    }
  };

const computedInitialValues = useMemo(() => {
  if (mode === 'edit') {
    return initialValues; 
  }

  return {
    domain: defaultDomain, // auto-set default domain
  };
}, [mode, initialValues, defaultDomain]);


  const handleSubmit = async (values: IUserCreate | IUserUpdate) => {
    try {
      // Remove confirmPassword from values before sending to API
      const { confirmPassword, domain, ...apiValues } = values as any;

      if (mode === 'create') {
        await addUser(apiValues as IUserCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/users');
        }
      } else if (mode === 'edit' && userId) {
        await editUser(userId, apiValues as IUserUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/users/${userId}`);
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        getErrorMessage(error) || t(LOCALE_KEYS.FAILED_NAME, { name: entityName });
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

  const getSubmitText = () => {
    return mode === 'create'
      ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
      : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });
  };


  const formContent = (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={computedInitialValues}
        aria-label={`${mode === 'create' ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName }) : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })} form`}
        role="form"
        autoComplete="off"
        
      >
        {/* Hidden fields to prevent browser autofill */}
        <input type="text" style={{ display: 'none' }} autoComplete="username" />
        <input type="password" style={{ display: 'none' }} autoComplete="current-password" />
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
          <Select
            placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.TYPE) })}
            aria-label={t(LOCALE_KEYS.TYPE)}
            aria-required="true"
            aria-describedby="type-help"
            onChange={handleTypeChange}
          >
            <Select.Option value="admin">{t(LOCALE_KEYS.ADMIN)}</Select.Option>
            <Select.Option value="faculty">{t(LOCALE_KEYS.FACULTY)}</Select.Option>
            <Select.Option value="student">{t(LOCALE_KEYS.STUDENT)}</Select.Option>
            <Select.Option value="employee">{t(LOCALE_KEYS.EMPLOYEE)}</Select.Option>
          </Select>
        </Form.Item>

        {/* Faculty Selection - Only show when type is faculty */}
        {selectedType === UserType.FACULTY && (
          <Form.Item
            name="facultyId"
            label={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.FACULTY) })}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.FACULTY) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.FACULTY) })}
              aria-label={t(LOCALE_KEYS.FACULTY)}
              aria-required="true"
              onChange={handleFacultyChange}
              showSearch
              filterOption={(input, option) =>
                String(option?.children || '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {faculties.map((faculty) => (
                <Select.Option key={faculty.id} value={faculty.id}>
                  {faculty.fullName} ({faculty.email})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {/* Student Selection - Only show when type is student */}
        {selectedType === UserType.STUDENT && (
          <Form.Item
            name="studentId"
            label={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.STUDENT) })}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.STUDENT) }),
              },
            ]}
          >
            <Select
              placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.STUDENT) })}
              aria-label={t(LOCALE_KEYS.STUDENT)}
              aria-required="true"
              onChange={handleStudentChange}
              showSearch
              filterOption={(input, option) =>
                String(option?.children || '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {students.map((student) => (
                <Select.Option key={student.id} value={student.id}>
                  {student.firstName + ' ' + (student?.middleName ?? '') + ' ' + student.lastName} (
                  {student.registrationNo})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="name"
          label={t(LOCALE_KEYS.NAME)}
          rules={[
            {
              required: true,
              message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.NAME) }),
            },
          ]}
        >
          <Input
            placeholder={t(LOCALE_KEYS.NAME)}
            aria-label={t(LOCALE_KEYS.NAME)}
            aria-required="true"
            aria-describedby="name-help"
            disabled={selectedType === UserType.FACULTY || selectedType === UserType.STUDENT}
          />
        </Form.Item>

        
        <Form.Item
          name="roleId"
          label={t(LOCALE_KEYS.ROLE)}
          rules={[
            {
              required: true,
              message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ROLE) }),
            },
          ]}
        >
          <Select
            placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.ROLE) })}
            aria-label={t(LOCALE_KEYS.ROLE)}
            aria-required="true"
            aria-describedby="role-help"
            // onChange={handleTypeChange}
          >
             {
              roles.map(role=><Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>)
            }
          </Select>
        </Form.Item>

        <Form.Item
          name="domain"
          label={t(LOCALE_KEYS.DOMAIN)}
          rules={[
            {
              required: true,
              message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DOMAIN) }),
            },
          ]}
        >
          <Select
            placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.DOMAIN) })}
            aria-label={t(LOCALE_KEYS.DOMAIN)}
            aria-required="true"
            aria-describedby="domain-help"
            onChange={handleDomainChange}
          >
            {
              domains?.items?.map((item:IDomainInfo)=><Select.Option key={item.id} value={item.externalId}>{item.externalId}</Select.Option>)
            }
          </Select>
        </Form.Item>

        <Form.Item
          name="email"
          label={t(LOCALE_KEYS.EMAIL)}
          rules={[
            { required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_EMAIL) },
            { type: 'email', message: t(LOCALE_KEYS.PLEASE_ENTER_VALID_EMAIL) },
          ]}
        >
          <Input
            placeholder={t(LOCALE_KEYS.EMAIL)}
            type="email"
            aria-label={t(LOCALE_KEYS.EMAIL)}
            aria-required="true"
            aria-describedby="email-help"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label={t(LOCALE_KEYS.PHONE)}
          rules={[{ pattern: /^[0-9+\-\s()]*$/, message: t(LOCALE_KEYS.PLEASE_ENTER_VALID_PHONE) }]}
        >
          <Input
            placeholder={t(LOCALE_KEYS.PHONE)}
            type="tel"
            aria-label={t(LOCALE_KEYS.PHONE)}
            aria-describedby="phone-help"
          />
        </Form.Item>

        {mode === 'create' && (
          <>
            <Form.Item
              name="password"
              label={t(LOCALE_KEYS.PASSWORD)}
              rules={[
                { required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_PASSWORD) },
                { min: 6, message: t(LOCALE_KEYS.PASSWORD_MIN_LENGTH) },
              ]}
            >
              <Input.Password
                placeholder={t(LOCALE_KEYS.PASSWORD)}
                aria-label={t(LOCALE_KEYS.PASSWORD)}
                aria-required="true"
                aria-describedby="password-help"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={t(LOCALE_KEYS.CONFIRM_PASSWORD)}
              dependencies={['password']}
              rules={[
                { required: true, message: t(LOCALE_KEYS.PLEASE_ENTER_CONFIRM_PASSWORD) },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t(LOCALE_KEYS.PASSWORDS_DO_NOT_MATCH)));
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder={t(LOCALE_KEYS.CONFIRM_PASSWORD)}
                aria-label={t(LOCALE_KEYS.CONFIRM_PASSWORD)}
                aria-required="true"
                aria-describedby="confirm-password-help"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </Form.Item>
          </>
        )}

        <StatusSelectFormItem options={ENTITY_STATUS_OPTIONS} />

        <Form.Item style={{ marginTop: '32px', textAlign: embedded ? 'right' : 'center' }}>
          <div role="group" aria-label="Form actions">
            <Space size={embedded ? 'small' : 'large'}>
              <Button
                loading={actionStatus.status === Status.LOADING}
                type="primary"
                htmlType="submit"
                size={embedded ? 'middle' : 'large'}
                style={{ minWidth: embedded ? '80px' : '120px' }}
                aria-label={`${getSubmitText()} button`}
              >
                {getSubmitText()}
              </Button>
              <Button
                onClick={handleCancel}
                size={embedded ? 'middle' : 'large'}
                style={{ minWidth: embedded ? '80px' : '120px' }}
                aria-label={t(LOCALE_KEYS.CANCEL) + ' button'}
              >
                {t(LOCALE_KEYS.CANCEL)}
              </Button>
            </Space>
          </div>
        </Form.Item>
      </Form>
    </>
  );

  return (
    <>
      {embedded ? (
        formContent
      ) : (
        <FormLayout>
          {/* <h1
              id="form-title"
              style={{
                marginBottom: '24px',
                textAlign: 'center',
                fontSize: '24px',
                fontWeight: 'bold'
              }}
            >
              {mode === 'create' ? 'Create New User' : 'Edit User'}
            </h1> */}
          {formContent}
        </FormLayout>
      )}
    </>
  );
};

export default UserForm;
