"use client"

import {
  DeleteOutlined,
  MessageOutlined,
} from "@ant-design/icons"
import { Avatar, Card, Button, Tooltip, Input, Collapse } from "antd"

import { Status } from "@/enums"

import { useSubjectDiscussionReplies } from "@/hooks/useSubjectDiscussionReplies"

const { Panel } = Collapse
export function MessageThread({
  message,
  isReplyOpen,
  onReplyClick,
  onCancelReply,
  onReply,
  onReplySubmit,
  setDiscussionReplyId,
  selectedSubjectDiscussion
}: any) {
  const { content } = message
  const { actionStatus, } = useSubjectDiscussionReplies()



  return (
    <Card className="border-0 shadow-sm">
      <Collapse onChange={()=>setDiscussionReplyId(message.id)} >
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
          {/* Content */}


          {/* Actions */}
          <div className="mt-3 flex gap-4">
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

            <Tooltip title="Delete">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </div>

          {/* Reply Input (ONLY for this thread) */}
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

          {/* Replies */}
          {selectedSubjectDiscussion?.replies?.length > 0 && (
            <div className="mt-4 space-y-3 border-l-2 pl-4">
              {selectedSubjectDiscussion?.replies.map((reply: any) => (
                <div key={reply.id} className="flex gap-3">
                  <Avatar size={32} />
                  <div>
                    <p className="text-sm font-semibold">{reply.author.name}</p>
                    <p className="text-sm">{reply.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </Collapse>
    </Card>
  )
}
