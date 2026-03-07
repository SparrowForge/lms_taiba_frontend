'use client'

import { EditOutlined, PhoneOutlined, MailOutlined, WhatsAppOutlined } from '@ant-design/icons'
import { Card, Row, Col, Divider, Button, Tag } from 'antd'
import React from "react"

import { IStudent } from '@/types/student'

interface BasicInformationProps {
  student: IStudent | null;
}

export default function ContactInformation({ student }: BasicInformationProps) {
  const InfoItem = ({ label, value, icon }: { label: string; value: string | null; icon?: React.ReactNode }) => (
    <div className="mb-4">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="font-medium text-sm">{value || 'N/A'}</p>
    </div>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <Card
        title="Contact Information"
        extra={<Button type="text" size="small" icon={<EditOutlined />} />}
        className="shadow-sm"
      >
        <div className="text-xs text-gray-500 mb-4">Phone numbers and email addresses</div>

        <InfoItem
          label="Primary Phone"
          value={student?.profile?.phone ?? null}
          icon={<PhoneOutlined className="text-blue-500" />}
        />

        <Divider className="my-4" />

        <InfoItem
          label="Secondary Phone"
          value={student?.profile?.mobile || 'N/A'}
          icon={<PhoneOutlined className="text-blue-500" />}
        />

        <Divider className="my-4" />

        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <WhatsAppOutlined className="text-green-500" />
            <span>WhatsApp Number</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">{student?.profile?.whatsappNumber || 'N/A'}</p>
            {student?.profile?.whatsappNumber && <Tag color="green">WhatsApp</Tag>}
          </div>
        </div>

        <Divider className="my-4" />

        <InfoItem
          label="Email Address"
          value={student?.profile?.email || null}
          icon={<MailOutlined className="text-blue-500" />}
        />
      </Card>

      <Card
        title="Present Address Information"
        extra={<Button type="text" size="small" icon={<EditOutlined />} />}
        className="shadow-sm"
      >
        <div className="text-xs text-gray-500 mb-4">
          Residential address details
        </div>

        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">
            Street Address (English)
          </div>
          <p className="font-medium text-sm">
            {student?.profile?.presentAddress.address}
          </p>
        </div>

        <Divider className="my-4" />

        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">
            Street Address (Arabic)
          </div>
          <p className="font-medium text-sm text-right" dir="rtl">
            {student?.profile?.presentAddress.address}
          </p>
        </div>

        <Divider className="my-4" />

        <Row gutter={16}>
          <Col span={12}>
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">City</div>
              <p className="font-medium text-sm">
                {student?.profile?.presentAddress.city}
              </p>
            </div>
          </Col>

          <Col span={12}>
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">Region</div>
              <p className="font-medium text-sm">
                {student?.profile?.presentAddress.state || '-'}
              </p>
            </div>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">
                Postal Code
              </div>
              <p className="font-medium text-sm">
                {student?.profile?.presentAddress.zipCode}
              </p>
            </div>
          </Col>

          <Col span={12}>
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">
                Country
              </div>
              <p className="font-medium text-sm">
                {student?.profile?.presentAddress.country}
              </p>
            </div>
          </Col>
        </Row>
      </Card>
      <Card
        title="Permanent Address Information"
        extra={<Button type="text" size="small" icon={<EditOutlined />} />}
        className="shadow-sm"
      >
        <div className="text-xs text-gray-500 mb-4">
          Residential address details
        </div>

        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">
            Street Address (English)
          </div>
          <p className="font-medium text-sm">
            {student?.profile?.permanentAddress.address}
          </p>
        </div>

        <Divider className="my-4" />

        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">
            Street Address (Arabic)
          </div>
          <p className="font-medium text-sm text-right" dir="rtl">
            {student?.profile?.permanentAddress.address}
          </p>
        </div>

        <Divider className="my-4" />

        <Row gutter={16}>
          <Col span={12}>
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">City</div>
              <p className="font-medium text-sm">
                {student?.profile?.permanentAddress.city}
              </p>
            </div>
          </Col>

          <Col span={12}>
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">Region</div>
              <p className="font-medium text-sm">
                {student?.profile?.permanentAddress.state || '-'}
              </p>
            </div>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">
                Postal Code
              </div>
              <p className="font-medium text-sm">
                {student?.profile?.permanentAddress.zipCode}
              </p>
            </div>
          </Col>

          <Col span={12}>
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">
                Country
              </div>
              <p className="font-medium text-sm">
                {student?.profile?.permanentAddress.country}
              </p>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
