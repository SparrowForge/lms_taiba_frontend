"use client"

import {
    DeleteOutlined,
    EditOutlined,
    MessageOutlined,
} from "@ant-design/icons"
import { Avatar, Button, Tooltip, Input, Collapse } from "antd"
import { useState } from "react"

import { Status } from "@/enums"



interface Props {
    replies: any[]
    actionStatus: any
    onReplySubmit: (parentReplyId: number, content: string) => void,
    setReplyId: any,
    selectedSubjectDiscussionReply: any
}

const { Panel } = Collapse

export function DiscussionReplies({
    replies,
    actionStatus,
    onReplySubmit,
    setReplyId,
    selectedSubjectDiscussionReply
}: Props) {
    const [activeReplyId, setActiveReplyId] = useState<number | null>(null)
    const [replyText, setReplyText] = useState("")

    const handleSubmit = (replyId: number) => {
        onReplySubmit(replyId, replyText)
        setReplyText("")
        setActiveReplyId(null)
    }

    console.log("DiscussionReplies",replies[0])

    return (
        <Collapse ghost className="mt-4 border-l-2 pl-4">
            {replies.map((reply) => (
                <Panel
                    key={reply.id}
                    header={
                        <div onChange={() => setReplyId(reply.id)} className="flex gap-3 items-center">
                            <Avatar size={32} />
                            <div>
                                <p className="text-sm font-semibold">
                                    {reply.author.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate max-w-[400px]">
                                    {reply.content}
                                </p>
                            </div>
                        </div>
                    }
                >

{/* {reply?.replies.length()} */}

                    <div className="mt-2 flex justify-end gap-4">
                        <Tooltip title="Reply">
                            <Button
                                type="text"
                                size="small"
                                icon={<MessageOutlined />}
                                onClick={() =>
                                    setActiveReplyId(
                                        activeReplyId === reply.id ? null : reply.id
                                    )
                                }
                            >
                                Reply
                            </Button>
                        </Tooltip>

                        <Tooltip title="Delete">
                            <Button
                                type="text"
                                size="small"

                                icon={<EditOutlined />}
                            >Edit</Button>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <Button
                                type="text"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                            >Delete</Button>
                        </Tooltip>
                    </div>
                </Panel>
            ))}
        </Collapse>
    )
}
