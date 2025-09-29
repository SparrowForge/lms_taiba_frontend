'use client';

import {Col, DatePicker, Form, Input, Row, Select, Switch} from 'antd';
import React, {useState} from 'react';

import {COUNTRIES} from '@/constants/countries';
import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';

interface StudentProfileStepProps {
  form: any; // FormInstance from antd
}

const StudentProfileStep: React.FC<StudentProfileStepProps> = ({ form }) => {
  const { t } = useLocalization();
  const [isInternational, setIsInternational] = useState(false);

  return (
    <div className="p-2">
      <h3 className="text-lg font-semibold mb-4">{t(LOCALE_KEYS.STUDENT_PROFILE)}</h3>
      <p className="text-gray-600 mb-6">{t(LOCALE_KEYS.STEP2_DESCRIPTION)}</p>

      <Form form={form} layout="vertical" className="w-full">
        {/* Personal Information */}
        <Row gutter={16} className="mb-4">
          <Col xs={24} md={8}>
            <Form.Item
              name="dob"
              label={t(LOCALE_KEYS.DATE_OF_BIRTH)}
              rules={[
                {
                  required: true,
                  message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DATE_OF_BIRTH) }),
                },
              ]}
            >
              <DatePicker
                placeholder={t(LOCALE_KEYS.SELECT_DATE_OF_BIRTH, {
                  defaultValue: 'Select date of birth',
                })}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="gender"
              label={t(LOCALE_KEYS.GENDER)}
              rules={[
                {
                  required: true,
                  message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.GENDER) }),
                },
              ]}
            >
              <Select
                placeholder={t(LOCALE_KEYS.SELECT_GENDER, { defaultValue: 'Select gender' })}
                options={[
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                  { label: 'Other', value: 'other' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="maritalStatus"
              label={t(LOCALE_KEYS.MARITAL_STATUS)}
              rules={[
                {
                  required: true,
                  message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                    name: t(LOCALE_KEYS.MARITAL_STATUS),
                  }),
                },
              ]}
            >
              <Select
                placeholder={t(LOCALE_KEYS.SELECT_MARITAL_STATUS, {
                  defaultValue: 'Select marital status',
                })}
                options={[
                  { label: 'Single', value: 'single' },
                  { label: 'Married', value: 'married' },
                  { label: 'Divorced', value: 'divorced' },
                  { label: 'Widowed', value: 'widowed' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Present Address Information */}
        <div className="mb-6">
          <h4 className="text-md font-medium mb-4 text-gray-700">
            {t(LOCALE_KEYS.PRESENT_ADDRESS)}
          </h4>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="presentAddressName"
                label={t(LOCALE_KEYS.NAME)}
                rules={[
                  {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.NAME) }),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="presentAddressEmail"
                label={t(LOCALE_KEYS.EMAIL)}
                rules={[
                  {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.EMAIL) }),
                  },
                  {
                    type: 'email',
                    message: t(LOCALE_KEYS.PLEASE_ENTER_VALID_NAME, { name: t(LOCALE_KEYS.EMAIL) }),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="presentAddressPhone"
                label={t(LOCALE_KEYS.PHONE)}
                rules={[
                  {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.PHONE) }),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="presentAddress"
            label={t(LOCALE_KEYS.ADDRESS)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ADDRESS) }),
              },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Form.Item
                name="presentCity"
                label={t(LOCALE_KEYS.CITY)}
                rules={[
                  {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.CITY) }),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                name="presentState"
                label={t(LOCALE_KEYS.STATE)}
                rules={[
                  {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.STATE) }),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                name="presentZipCode"
                label={t(LOCALE_KEYS.ZIP_CODE)}
                rules={[
                  {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ZIP_CODE) }),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                name="presentCountry"
                label={t(LOCALE_KEYS.COUNTRY)}
                rules={[
                  {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.COUNTRY) }),
                  },
                ]}
              >
                <Select
                  placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.COUNTRY) })}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={COUNTRIES.map((country) => ({
                    label: `${country.name} (${country.code})`,
                    value: country.code,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Permanent Address Information */}
        <div className="mb-6">
          <h4 className="text-md font-medium mb-4 text-gray-700">
            {t(LOCALE_KEYS.PERMANENT_ADDRESS)}
          </h4>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="permanentAddressName"
                label={t(LOCALE_KEYS.NAME)}
                rules={[
                  {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.NAME) }),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="permanentAddressEmail"
                label={t(LOCALE_KEYS.EMAIL)}
                rules={[
                  {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.EMAIL) }),
                  },
                  {
                    type: 'email',
                    message: t(LOCALE_KEYS.PLEASE_ENTER_VALID_NAME, { name: t(LOCALE_KEYS.EMAIL) }),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                name="permanentAddressPhone"
                label={t(LOCALE_KEYS.PHONE)}
                rules={[
                  {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.PHONE) }),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="permanentAddress"
            label={t(LOCALE_KEYS.ADDRESS)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ADDRESS) }),
              },
            ]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={6}>
              <Form.Item
                name="permanentCity"
                label={t(LOCALE_KEYS.CITY)}
                rules={[
                  {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.CITY) }),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                name="permanentState"
                label={t(LOCALE_KEYS.STATE)}
                rules={[
                  {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.STATE) }),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                name="permanentZipCode"
                label={t(LOCALE_KEYS.ZIP_CODE)}
                rules={[
                  {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.ZIP_CODE) }),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} md={6}>
              <Form.Item
                name="permanentCountry"
                label={t(LOCALE_KEYS.COUNTRY)}
                rules={[
                  {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.COUNTRY) }),
                  },
                ]}
              >
                <Select
                  placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.COUNTRY) })}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={COUNTRIES.map((country) => ({
                    label: `${country.name} (${country.code})`,
                    value: country.code,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Identity Information */}
        <Row gutter={16} className="mb-4">
          <Col xs={24} md={12}>
            <Form.Item
              name="identityType"
              label={t(LOCALE_KEYS.IDENTITY_TYPE)}
              rules={[
                {
                  required: true,
                  message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.IDENTITY_TYPE) }),
                },
              ]}
            >
              <Select
                placeholder={t(LOCALE_KEYS.SELECT_IDENTITY_TYPE, {
                  defaultValue: 'Select identity type',
                })}
                options={[
                  { label: 'National ID', value: 'nid' },
                  { label: 'Passport', value: 'passport' },
                  { label: 'Driver License', value: 'driver_license' },
                  { label: 'Other', value: 'other' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="identityNo"
              label={t(LOCALE_KEYS.IDENTITY_NO)}
              rules={[
                {
                  required: true,
                  message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.IDENTITY_NO) }),
                },
              ]}
            >
              <Input
                placeholder={t(LOCALE_KEYS.ENTER_IDENTITY_NO, {
                  defaultValue: 'Enter identity number',
                })}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Additional Information */}
        <Row gutter={16} className="mb-4">
          <Col xs={24} md={12}>
            <Form.Item
              name="isTransferred"
              label={t(LOCALE_KEYS.IS_TRANSFERRED)}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="isInternational"
              label={t(LOCALE_KEYS.IS_INTERNATIONAL)}
              valuePropName="checked"
            >
              <Switch
                onChange={(checked) => {
                  setIsInternational(checked);
                  if (!checked) {
                    form.setFieldsValue({ countryCode: undefined });
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Country Selection for International Students */}
        {isInternational && (
          <Row gutter={16} className="mb-4">
            <Col xs={24} md={12}>
              <Form.Item
                name="countryCode"
                label={t(LOCALE_KEYS.COUNTRY)}
                rules={[
                  {
                    required: true,
                    message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.COUNTRY) }),
                  },
                ]}
              >
                <Select
                  placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.COUNTRY) })}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={COUNTRIES.map((country) => ({
                    label: `${country.name} (${country.code})`,
                    value: country.code,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Transfer Information */}
        <Form.Item name="transferInfo" label={t(LOCALE_KEYS.TRANSFER_INFO)}>
          <Input.TextArea
            rows={3}
            placeholder={t(LOCALE_KEYS.ENTER_TRANSFER_INFO, {
              defaultValue: 'Enter transfer information',
            })}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default StudentProfileStep;
