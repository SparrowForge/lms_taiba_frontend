"use client"


import { Button, Form, Input } from "antd"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "react-toastify"

import { LOCALE_KEYS } from "@/constants/localizationKeys"
import { Status } from "@/enums"

import LexicalEditor from "@/components/ui/LexicalEditor"

import { useLocalization } from "@/hooks/useLocalization"
import { useSubjectDiscussions } from "@/hooks/useSubjectDiscussions"

import { getErrorMessage } from "@/types/errors"
import { ISubjectDiscussion, ISubjectDiscussionCreate, ISubjectDiscussionUpdate } from "@/types/subjectDiscussion"

import type React from "react"

interface DiscussionFormProps {
  mode: 'create' | 'edit';
  discussionId?: number;
  initialValues?: Partial<ISubjectDiscussionCreate | ISubjectDiscussionUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;

}

const MessageForm: React.FC<DiscussionFormProps> = ({
  mode,
  discussionId,
  initialValues,
  onSuccess,
  onCancel,

}) => {
  const { t } = useLocalization()
  const [form] = Form.useForm();
  const { id } = useParams()
  const { createSubjectDiscussion, actionStatus, editSubjectDiscussion} = useSubjectDiscussions()

  const entityName = t(LOCALE_KEYS.DISCUSSION, { defaultValue: 'Discussion' });

  const handleSubmit = async (values: Partial<ISubjectDiscussion>) => {
    try {
      if (mode === 'create') {
        const data = {
          subjectId: Number(id),
          fileIds: [],
          title: values.title,
          content: values.content,
          status: "active",
          isPinned: false,
          isLocked: false
        }
        await createSubjectDiscussion(data as ISubjectDiscussionCreate);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
        }
      } else if (mode === 'edit' && discussionId) {
        await editSubjectDiscussion(discussionId, values as ISubjectDiscussionUpdate);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        if (onSuccess) {
          onSuccess();
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
    } 
  };

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
          loading={actionStatus.status === Status.LOADING}
          style={{marginRight:8}}
        >
          {getSubmitText()}
        </Button>
        <Button onClick={handleCancel}>{t(LOCALE_KEYS.CANCEL)}</Button>
      </Form.Item>
    </Form>
  )
}
export default MessageForm;