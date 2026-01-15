"use client"


import { SendOutlined } from "@ant-design/icons"
import { Button, Form, Input } from "antd"
import { useParams } from "next/navigation"
import { useState } from "react"


import { LOCALE_KEYS } from "@/constants/localizationKeys"
import { Status } from "@/enums"

import LexicalEditor from "@/components/ui/LexicalEditor"

import { useLocalization } from "@/hooks/useLocalization"
import { useSubjectDiscussions } from "@/hooks/useSubjectDiscussions"

import type React from "react"


export function MessageForm() {
  const { t } = useLocalization()
  const [form] = Form.useForm();
  const { id } = useParams()
  const { createSubjectDiscussion, actionStatus } = useSubjectDiscussions()
  const [mode, setMode] = useState("create")
  const entityName = t(LOCALE_KEYS.DISCUSSION, { defaultValue: 'Discussion' });


  const handleSubmit = async (values) => {
    console.log("object", values)
    const data = {
      subjectId: Number(id),
      fileIds: [],
      title: values.title,
      content: values.content,
      status: "active",
      isPinned: false,
      isLocked: false
    }
    await createSubjectDiscussion(data)
  }

  const getSubmitText = () =>
    mode === 'create'
      ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
      : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={mode === 'edit' ? initialValues : undefined}
    >
      <Form.Item name="title">
        <Input placeholder={t(LOCALE_KEYS.TITLE)} />
      </Form.Item>
      <Form.Item
        name="content"
        label={t(LOCALE_KEYS.DESCRIPTION)}
        rules={[
          {
            required: true,
            message: t(LOCALE_KEYS.PLEASE_ENTER_NAME, { name: t(LOCALE_KEYS.DESCRIPTION) }),
          },
        ]}
      >
        <LexicalEditor />
      </Form.Item>

      <Form.Item>
        <Button
          htmlType="submit"
          type="primary"
          icon={<SendOutlined />}
          loading={actionStatus.status === Status.LOADING}
        >
          {getSubmitText()}
        </Button>
      </Form.Item>
    </Form>
  )
}
