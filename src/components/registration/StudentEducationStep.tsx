'use client';

import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import React from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useLocalization } from '@/hooks/useLocalization';

interface StudentEducationStepProps {
  form: any; // FormInstance from antd
}

const StudentEducationStep: React.FC<StudentEducationStepProps> = ({ form }) => {
  const { t } = useLocalization();

  return (
    <div className="p-2">
      <h3 className="text-lg font-semibold mb-4">{t(LOCALE_KEYS.STUDENT_EDUCATION)}</h3>
      <p className="text-gray-600 mb-6">{t(LOCALE_KEYS.STEP3_DESCRIPTION)}</p>

      {/* Uses parent form context; no nested Form here */}
      <Form.List name="educations">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                  <h4 className="text-md font-medium text-gray-700">
                    {t(LOCALE_KEYS.EDUCATION_ENTRY, { number: name + 1 })}
                  </h4>
                  {fields.length > 1 && (
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(name)}
                      className="text-red-500 hover:text-red-700"
                    >
                      {t(LOCALE_KEYS.REMOVE)}
                    </Button>
                  )}
                </div>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'degreeType']}
                      label={t(LOCALE_KEYS.DEGREE_TYPE)}
                      rules={[
                        {
                          required: true,
                          message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                            name: t(LOCALE_KEYS.DEGREE_TYPE),
                          }),
                        },
                      ]}
                    >
                      <Select
                        placeholder={t(LOCALE_KEYS.SELECT_DEGREE_TYPE, {
                          defaultValue: 'Select Degree Type',
                        })}
                        options={[
                          { label: 'High School', value: 'High School' },
                          { label: 'Diploma', value: 'Diploma' },
                          { label: 'Bachelor', value: 'Bachelor' },
                          { label: 'Master', value: 'Master' },
                          { label: 'PhD', value: 'PhD' },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'degreeName']}
                      label={t(LOCALE_KEYS.DEGREE_NAME)}
                      rules={[
                        {
                          required: true,
                          message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                            name: t(LOCALE_KEYS.DEGREE_NAME),
                          }),
                        },
                      ]}
                    >
                      <Input
                        placeholder={t(LOCALE_KEYS.ENTER_DEGREE_NAME, {
                          defaultValue: 'Enter degree name',
                        })}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'passingYear']}
                      label={t(LOCALE_KEYS.PASSING_YEAR)}
                      rules={[
                        {
                          required: true,
                          message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                            name: t(LOCALE_KEYS.PASSING_YEAR),
                          }),
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder={t(LOCALE_KEYS.ENTER_PASSING_YEAR, {
                          defaultValue: 'Enter passing year',
                        })}
                        min={1900}
                        max={new Date().getFullYear() + 10}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'institute']}
                      label={t(LOCALE_KEYS.INSTITUTE)}
                      rules={[
                        {
                          required: true,
                          message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                            name: t(LOCALE_KEYS.INSTITUTE),
                          }),
                        },
                      ]}
                    >
                      <Input
                        placeholder={t(LOCALE_KEYS.ENTER_INSTITUTE, {
                          defaultValue: 'Enter institute',
                        })}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'result']}
                      label={t(LOCALE_KEYS.RESULT)}
                      rules={[
                        {
                          required: true,
                          message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                            name: t(LOCALE_KEYS.RESULT),
                          }),
                        },
                      ]}
                    >
                      <Input
                        placeholder={t(LOCALE_KEYS.ENTER_RESULT, {
                          defaultValue: 'Enter result (e.g., 3.7 GPA)',
                        })}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'groupMajor']}
                      label={t(LOCALE_KEYS.GROUP_MAJOR)}
                      rules={[
                        {
                          required: true,
                          message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, {
                            name: t(LOCALE_KEYS.GROUP_MAJOR),
                          }),
                        },
                      ]}
                    >
                      <Input
                        placeholder={t(LOCALE_KEYS.ENTER_GROUP_MAJOR, {
                          defaultValue: 'Enter group/major',
                        })}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'foundationCourse']}
                      label={t(LOCALE_KEYS.FOUNDATION_COURSE)}
                    >
                      <Input
                        placeholder={t(LOCALE_KEYS.ENTER_FOUNDATION_COURSE, {
                          defaultValue: 'Enter foundation course',
                        })}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                className="mb-4"
              >
                {t(LOCALE_KEYS.ADD_EDUCATION_ENTRY, { defaultValue: 'Add Education Entry' })}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </div>
  );
};

export default StudentEducationStep;
