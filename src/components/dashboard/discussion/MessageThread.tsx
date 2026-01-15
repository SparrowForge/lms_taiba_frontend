"use client"

import { Avatar, Card, Button, Tooltip } from "antd"
import { LikeOutlined, LikeFilled, DeleteOutlined, MessageOutlined  } from "@ant-design/icons"
import { formatDistanceToNow } from "date-fns"
import { MessageForm } from "./MessageForm"
import { IMessage } from "@/types/discussion"



interface MessageThreadProps {
  message: IMessage
  onReply: () => void
  onLike: () => void
  onDelete: () => void
  onReplySubmit: (text: string) => void
  onReplyLike: (replyId: string) => void
  onReplyDelete: (replyId: string) => void
  isReplyingTo: boolean
  onCancelReply: () => void
}

export function MessageThread({
  message,
  onReply,
  onLike,
  onDelete,
  onReplySubmit,
  onReplyLike,
  onReplyDelete,
  isReplyingTo,
  onCancelReply,
}: MessageThreadProps) {
  return (
    <Card className="border-0 shadow-sm">
      {/* Main Message */}
      <div className="space-y-4">
        <div className="flex gap-3">
          <Avatar src={message.avatar} size={40} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold ">{message.author}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(message.timestamp), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <p className="mt-2 ">{message.content}</p>

            {/* Message Actions */}
            <div className="mt-3 flex gap-4">
              <Tooltip title={message.liked ? "Unlike" : "Like"}>
                <Button
                  type="text"
                  size="small"
                  icon={message.liked ? <LikeFilled /> : <LikeOutlined />}
                  onClick={onLike}
                  className={message.liked ? "text-blue-500" : ""}
                >
                  {message.likes > 0 && message.likes}
                </Button>
              </Tooltip>

              <Tooltip title="Reply">
                <Button type="text" size="small" icon={<MessageOutlined  />} onClick={onReply}>
                  Reply
                </Button>
              </Tooltip>

              <Tooltip title="Delete">
                <Button type="text" size="small" danger icon={<DeleteOutlined />} onClick={onDelete} />
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Replies Section */}
        {message.replies && message.replies.length > 0 && (
          <div className="mt-4 space-y-3 border-l-2 border-border pl-4">
            {message.replies.map((reply) => (
              <div key={reply.id} className="space-y-2">
                <div className="flex gap-3">
                  <Avatar src={reply.avatar} size={32} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold ">{reply.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(reply.timestamp), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="mt-1 text-sm ">{reply.content}</p>

                    {/* Reply Actions */}
                    <div className="mt-2 flex gap-4">
                      <Tooltip title={reply.liked ? "Unlike" : "Like"}>
                        <Button
                          type="text"
                          size="small"
                          icon={reply.liked ? <LikeFilled /> : <LikeOutlined />}
                          onClick={() => onReplyLike(reply.id)}
                          className={reply.liked ? "text-blue-500" : ""}
                        >
                          {reply.likes > 0 && reply.likes}
                        </Button>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => onReplyDelete(reply.id)}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reply Form */}
        {isReplyingTo && (
          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <p className="text-sm font-semibold ">Replying to {message.author}</p>
            <MessageForm onSubmit={onReplySubmit} placeholder={`Reply to ${message.author}...`} isReply />
            <Button size="small" onClick={onCancelReply}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}
