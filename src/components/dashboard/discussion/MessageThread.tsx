"use client"

import {
  DeleteOutlined,
  EditOutlined,
  MessageOutlined,
} from "@ant-design/icons"
import { Avatar, Card, Button, Tooltip, Input, Collapse } from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

import { LOCALE_KEYS } from "@/constants/localizationKeys"
import { Status } from "@/enums"

import { useAuth } from "@/hooks/useAuth"
import { useLocalization } from "@/hooks/useLocalization"
import { useSubjectDiscussionReplies } from "@/hooks/useSubjectDiscussionReplies"
import { useSubjectDiscussions } from "@/hooks/useSubjectDiscussions"

import { getErrorMessage } from "@/types/errors"


import { DiscussionReplies } from "./DiscussionReplies"
import { formatTime } from "@/utils/timeFormatUtils"

const { Panel } = Collapse
export function MessageThread({
  message,
  isReplyOpen,
  onReplyClick,
  onCancelReply,
  onReply,
  onReplySubmit,
  setDiscussionReplyId,
  selectedSubjectDiscussion,
  onEditDrawer,
  flag,
  setFlag

}: any) {
  const { content } = message
  const { actionStatus, createSubjectDiscussionReply, loadSubjectDiscussionReply, editSubjectDiscussionReply } = useSubjectDiscussionReplies()
  const { removeSubjectDiscussion, } = useSubjectDiscussions()
  const [replyId, setReplyId] = useState("")
  const { user } = useAuth()

  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const { t } = useLocalization()
  const entityName = t(LOCALE_KEYS.DISCUSSION, { defaultValue: 'Discussion' });


  useEffect(() => {
    if (replyId) {
      loadSubjectDiscussionReply(Number(replyId))
    }
  }, [loadSubjectDiscussionReply, replyId, flag])


  const handleSubmit = async (parentReplyId: number,
    content: string) => {

    try {
      if (mode === 'create') {
        const data = {
          discussionId: Number(message.id),
          parentReplyId,
          content,
          fileIds: [],
          status: "active",
        }
        await createSubjectDiscussionReply(data);
        toast.success(t(LOCALE_KEYS.CREATED_NAME, { name: entityName }));
        setFlag(!flag)
      } else if (mode === 'edit' && parentReplyId) {
        const data = {
          discussionId: Number(message.id),
          parentReplyId: null,
          content,
          status: "active",
        }
        console.log(data)
        await editSubjectDiscussionReply(parentReplyId, data);
        toast.success(t(LOCALE_KEYS.UPDATED_NAME, { name: entityName }));
        setFlag(!flag)
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

  const handleRemoveDisuccsion = async (id: number) => {
    await removeSubjectDiscussion(id)
    toast.success("Deleted Successfully!")
  }



  return (
    <>
      <Collapse onChange={() => setDiscussionReplyId(message.id)} style={{ margin: "16px 0" }}>
        <Panel
          key={message.id}
          header={
            <div className="flex  justify-between w-full flex-wrap gap-2">
              <div className="flex items-start gap-4">
                <Avatar
                  src={message.author.avatarUrl}
                  alt={message.author.name} 
                  size={24}
                  shape="circle" />
                <div>
                  <p className=""><span className="font-semibold">{message.author.name}</span> 
                  <span className="text-gray-400 font-normal text-xs ml-1 mb-1">  ({message.author.type.toUpperCase()}) Posted {formatTime(message.createdAt)}</span></p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: content,
                    }}
                  />
                </div>
              </div>

            </div>
          }
        >


          {selectedSubjectDiscussion?.replies?.length > 0 && (
            <DiscussionReplies
              replies={selectedSubjectDiscussion.replies}
              actionStatus={actionStatus}
              onReplySubmit={handleSubmit}
              setReplyId={setReplyId}
              setFlag={setFlag}
              setMode={setMode}
              flag={flag}
            />
          )}

          <div className="mt-3 flex justify-start border-t-1 border-gray-400 gap-4 py-2">
            {
              (message.isLocked === true) ? <p className="text-red-400">Author locked this message. You can&apos;t reply anymore</p> : <Tooltip title="Reply">
                <Button
                  type="text"
                  size="small"
                  icon={<MessageOutlined />}
                  onClick={onReplyClick}
                >
                  Reply
                </Button>
              </Tooltip>
            }

            {
              user?.id === message.author.id && <>
                <Tooltip title="Edit">
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => onEditDrawer(message.id)}
                  >Edit</Button>
                </Tooltip>

                <Tooltip title="Delete">
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveDisuccsion(message.id)}
                  >Delete</Button>
                </Tooltip>
              </>
            }
          </div>

          {isReplyOpen && (
            <div className="mt-3 space-y-2">
              <Input.TextArea
                placeholder="Write a reply..."
                onChange={(e) => onReply(message.id, e.target.value)}
              />
              <div className="flex gap-2 mt-2">
                <Button
                  size="small"
                  type="primary"
                  onClick={onReplySubmit}
                  loading={actionStatus.status === Status.LOADING}
                >
                  Submit
                </Button>
                <Button size="small" onClick={onCancelReply}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Panel>
      </Collapse>
    </>
  )
}
