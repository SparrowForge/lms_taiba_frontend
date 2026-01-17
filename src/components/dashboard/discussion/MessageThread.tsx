"use client"

import {
  DeleteOutlined,
  EditOutlined,
  MessageOutlined,
} from "@ant-design/icons"
import { Avatar, Card, Button, Tooltip, Input, Collapse } from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

import { Status } from "@/enums"

import { useAuth } from "@/hooks/useAuth"
import { useSubjectDiscussionReplies } from "@/hooks/useSubjectDiscussionReplies"
import { useSubjectDiscussions } from "@/hooks/useSubjectDiscussions"

import { DiscussionReplies } from "./DiscussionReplies"

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
  onEditDrawer

}: any) {
  const { content } = message
  const { actionStatus, createSubjectDiscussionReply, loadSubjectDiscussionReply, selectedSubjectDiscussionReply } = useSubjectDiscussionReplies()
  const {removeSubjectDiscussion, actionStatus : subjectDiscussionActionStatus} = useSubjectDiscussions()
  const [replyId, setReplyId] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    if (replyId) {
      loadSubjectDiscussionReply(Number(replyId))
    }
  }, [loadSubjectDiscussionReply, replyId])

  const handleSubjectDiscussionReplySubmit = async (
    parentReplyId: number,
    content: string
  ) => {
    const data = {
      discussionId: Number(message.id),
      parentReplyId,
      content,
      fileIds: [],
      status: "active",
    }

    await createSubjectDiscussionReply(data)
  }

  const handleRemoveDisuccsion = async(id:number) =>{
    await removeSubjectDiscussion(id)
    toast.success("Deleted Successfully!")
  }



  return (
    <>
      <Collapse onChange={() => setDiscussionReplyId(message.id)} style={{ margin: "16px 0" }}>
        <Panel
          key={message.id}
          header={
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="font-semibold">{message.author.name}</p>
                <div
                  dangerouslySetInnerHTML={{
                    __html: content,
                  }}
                />
              </div>
              {/* <span className="text-xs text-gray-500">
                {message.replies?.length || 0} replies
              </span> */}
            </div>
          }
        >


          {selectedSubjectDiscussion?.replies?.length > 0 && (
            <DiscussionReplies
              replies={selectedSubjectDiscussion.replies}
              actionStatus={actionStatus}
              onReplySubmit={handleSubjectDiscussionReplySubmit}
              setReplyId={setReplyId}
              selectedSubjectDiscussionReply={selectedSubjectDiscussionReply}
            />
          )}

          <div className="mt-3 flex justify-end gap-4">
            <Tooltip title="Reply">
              <Button
                type="text"
                size="small"
                icon={<MessageOutlined />}
                onClick={onReplyClick}
              >
                Reply
              </Button>
            </Tooltip>

            {
              user?.id === message.author.id && <>
                <Tooltip title="Edit">
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={()=>onEditDrawer(message.id)}
                  >Edit</Button>
                </Tooltip>

                <Tooltip title="Delete">
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={()=>handleRemoveDisuccsion(message.id)}
                  >Delete</Button>
                </Tooltip>
              </>
            }
          </div>

          {isReplyOpen && (
            <div className="mt-3 space-y-2">
              <Input
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
