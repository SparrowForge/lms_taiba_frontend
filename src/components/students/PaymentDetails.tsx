'use client'

import {
  DownloadOutlined,
  CreditCardOutlined,
} from '@ant-design/icons'
import {
  Card,
  Progress,
  Table,
  Button,
  Tag,
  Space,
  Row,
  Col,
  Statistic,
} from 'antd'
import dayjs from 'dayjs'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { UserType } from '@/enums/user-type.enum'

import { useAuth } from '@/hooks/useAuth'
import { useFeePaymentCollections } from '@/hooks/useFeePaymentCollections'

import { IFeePaymentCollection } from '@/types/feePaymentCollection'

import type { TableColumnsType } from 'antd'

const PaymentDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const { loadFeePaymentCollections, feePaymentCollections } =
    useFeePaymentCollections()
  const router = useRouter()

  useEffect(() => {
    if (id || user.type === UserType.STUDENT) {
      loadFeePaymentCollections({
        studentId: id ? id : user?.student?.id,
      })
    }
  }, [id, loadFeePaymentCollections, user?.student?.id, user.type])



  const feeStructure = feePaymentCollections?.[0]?.feeStructure
  const student = feePaymentCollections?.[0]?.student

  const totalFees = feeStructure?.totalFees ?? 0
  const discount = feeStructure?.discountAmount ?? 0
  const payableAmount = totalFees - discount

  const totalPaid = useMemo(() => {
    return feePaymentCollections?.reduce(
      (sum, p) => sum + (p.amountPaid || 0),
      0,
    )
  }, [feePaymentCollections])

  const progressPercent =
    payableAmount > 0
      ? Math.round((totalPaid / payableAmount) * 100)
      : 0

  const handleMakePayment = () => {
    if (id) {
      return router.push(`/fee-payment-collections/create?studentId=${id}`)
    } else if (user?.id) {
      return router.push(`/fee-payment-collections/create?studentId=${user?.id}`)
    }

  }



  const columns: TableColumnsType<IFeePaymentCollection> = [
    {
      title: 'Date',
      dataIndex: 'paymentDate',
      render: (value) => dayjs(value).format('DD MMM YYYY'),
    },
    {
      title: 'Mode',
      dataIndex: 'paymentMode',
      render: (value) => (
        <Tag color="blue">{value?.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Reference',
      dataIndex: 'transactionRef',
    },
    {
      title: 'Amount',
      dataIndex: 'amountPaid',
      align: 'right',
      render: (value, record) => (
        <strong>
          {record.currency} {value?.toLocaleString()}
        </strong>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value) => (
        <Tag color={value === 'paid' ? 'green' : 'orange'}>
          {value.toUpperCase()}
        </Tag>
      ),
    },
  ]

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>

      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={8}>
            <Statistic
              title="Student"
              value={`${student?.firstName} ${student?.lastName}`}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Registration No"
              value={student?.registrationNo}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Card No"
              value={student?.cardNo}
            />
          </Col>
        </Row>
      </Card>


      <Card style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <h3 style={{ marginBottom: 4 }}>
              Payment Progress
            </h3>
            <span>
              {feeStructure?.currency}{' '}
              {totalPaid.toLocaleString()} /{' '}
              {payableAmount.toLocaleString()}
            </span>
          </Col>
          <Col>
            <strong>{progressPercent}%</strong>
          </Col>
        </Row>

        <Progress
          percent={progressPercent}
          showInfo={false}
          style={{ marginTop: 16 }}
        />
      </Card>


      <Card title="Fee Structure" style={{ marginBottom: 24 }}>
        <Row gutter={[24, 16]}>
          <Col span={6}>
            <Statistic
              title="Template"
              value={feeStructure?.templateName}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Payment Type"
              value={feeStructure?.paymentType}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Total Fees"
              value={`${feeStructure?.currency} ${totalFees.toLocaleString()}`}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Discount"
              value={`${feeStructure?.currency} ${discount.toLocaleString()}`}
            />
          </Col>
        </Row>
      </Card>

      {/* PAYMENT HISTORY */}
      <Card
        title="Payment History"
        extra={
          <Space>
            {/* <Button icon={<DownloadOutlined />}>
              Download
            </Button> */}
            <Button
              type="primary"
              icon={<CreditCardOutlined />}
              onClick={() => handleMakePayment()}
            >
              Make Payment
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={feePaymentCollections}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  )
}

export default PaymentDetails
