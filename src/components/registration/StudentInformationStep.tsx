'use client';

import { Col, Form, Input, Row, Select } from 'antd';
import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';
import { useSections } from '@/hooks/useSections';

interface StudentInformationStepProps {
  form: any; // FormInstance from antd
}

const StudentInformationStep: React.FC<StudentInformationStepProps> = ({ form, sections }) => {
  const { t } = useLocalization();


  return (
    <div className="p-2 ">
      <h3 className="text-lg font-semibold mb-4">{t(LOCALE_KEYS.STUDENT_INFORMATION)}</h3>
      <p className="text-gray-600 mb-6">{t(LOCALE_KEYS.STEP1_DESCRIPTION)}</p>

      {/* Uses parent form context; no nested Form here */}
      {/* Name Fields */}
      <Row gutter={16} className="mb-4">
        <Col xs={24} md={8}>
          <Form.Item
            name="firstName"
            label={t(LOCALE_KEYS.FIRST_NAME)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.FIRST_NAME) }),
              },
            ]}
          >
            <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.FIRST_NAME) })} />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item name="middleName" label={t(LOCALE_KEYS.MIDDLE_NAME)}>
            <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.MIDDLE_NAME) })} />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            name="lastName"
            label={t(LOCALE_KEYS.LAST_NAME)}
            rules={[
              {
                required: true,
                message: t(LOCALE_KEYS.PLEASE_ENTER_LAST_NAME),
              },
            ]}
          >
            <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.LAST_NAME) })} />
          </Form.Item>
        </Col>
      </Row>

      {/* Contact Fields */}
      <Row gutter={16} className="mb-4">
        <Col xs={24} md={6}>
          <Form.Item
            name="email"
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
            <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.EMAIL) })} />
          </Form.Item>
        </Col>

        <Col xs={24} md={6}>
          <Form.Item
            name="phone"
            label={t(LOCALE_KEYS.PHONE)}
            rules={[
              {
                required: false,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.PHONE) }),
              },
            ]}
          >
            <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.PHONE) })} />
          </Form.Item>
        </Col>

        <Col xs={24} md={6}>
          <Form.Item
            name="mobile"
            label={t(LOCALE_KEYS.MOBILE)}
            rules={[
              {
                required: false,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.MOBILE) }),
              },
            ]}
          >
            <Input placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.MOBILE) })} />
          </Form.Item>
        </Col>

        <Col xs={24} md={6}>
          <Form.Item
            name="whatsappNumber"
            label={t(LOCALE_KEYS.WHATSAPP_NUMBER)}
            rules={[
              {
                required: false,
                message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                  name: t(LOCALE_KEYS.WHATSAPP_NUMBER),
                }),
              },
            ]}
          >
            <Input
              placeholder={t(LOCALE_KEYS.ENTER_NAME, { name: t(LOCALE_KEYS.WHATSAPP_NUMBER) })}
            />
          </Form.Item>
          
        </Col>
         <Col xs={24} md={8}>
            <Form.Item
        name="sectionId"
        label={t(LOCALE_KEYS.SECTION)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_SELECT_NAME, { name: t(LOCALE_KEYS.SECTION) }),
          },
        ]}
      >
        <Select placeholder={t(LOCALE_KEYS.SELECT_NAME, { name: t(LOCALE_KEYS.SECTION) })}>
          {sections.map((sections) => (
            <Select.Option key={sections.id} value={sections.id}>
              {sections.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
         </Col>
      </Row>
    </div>
  );
};

export default StudentInformationStep;
