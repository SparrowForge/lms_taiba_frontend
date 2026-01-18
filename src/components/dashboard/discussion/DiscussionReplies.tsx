"use client"

import {
    DeleteOutlined,
    EditOutlined,
    MessageOutlined,
} from "@ant-design/icons"
import { Avatar, Button, Tooltip, Input, Collapse } from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

import { LOCALE_KEYS } from "@/constants/localizationKeys"
import { Status } from "@/enums"

import { useAuth } from "@/hooks/useAuth"
import { useLocalization } from "@/hooks/useLocalization"
import { useSubjectDiscussionReplies } from "@/hooks/useSubjectDiscussionReplies"

import { getErrorMessage } from "@/types/errors"
import { ISubjectDiscussionReply } from "@/types/subjectDiscussionReply"




interface Props {
    replies: ISubjectDiscussionReply[]
    actionStatus: any
    onReplySubmit: (parentReplyId: number, content: string) => void,
    setReplyId: any,

    setMode: any,
    flag:boolean
}

const { Panel } = Collapse

export function DiscussionReplies({
    replies,
    actionStatus,
    onReplySubmit,
    setReplyId,

    setMode,
    flag
}: Props) {
    const [activeReplyId, setActiveReplyId] = useState<number | null>(null)
    const [editReplyId, setEditReplyId] = useState<number | null>(null)
    const [replyText, setReplyText] = useState("")
    const { removeSubjectDiscussionReply, selectedSubjectDiscussionReply, loadSubjectDiscussionReply } = useSubjectDiscussionReplies()
    const { t } = useLocalization()
    const entityName = t(LOCALE_KEYS.DISCUSSION, { defaultValue: 'Discussion' });

    const handleSubmit = (replyId: number) => {
        onReplySubmit(replyId, replyText)
        setReplyText("")
        setActiveReplyId(null)
        setEditReplyId(null)
    }

    const handleRemoveDisuccsionReply = async (id: number) => {
        try {
            if (id) {
                await removeSubjectDiscussionReply(id)
            }
        } catch (error: unknown) {
            let errorMessage = t(LOCALE_KEYS.FAILED_NAME, {
                name: entityName,
                defaultValue: `Failed to delete ${entityName.toLowerCase()}`,
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

        toast.success("Deleted Successfully!")
    }

    const { user } = useAuth()

    const onHandleReply = (id:number) =>{
         setActiveReplyId(id)
         setEditReplyId(null)
    }

    const onEditDiscussionReply = (replyId: number) => {
        setMode("edit")
        setEditReplyId(replyId)
        setActiveReplyId(null)
    }

    useEffect(() => {
        if (activeReplyId) {
            loadSubjectDiscussionReply(Number(activeReplyId))
        }
    }, [activeReplyId, loadSubjectDiscussionReply, flag])

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

                    <div className="mt-2 flex justify-end gap-4">
                        <Tooltip title="Reply">
                            <Button
                                type="text"
                                size="small"
                                icon={<MessageOutlined />}
                                onClick={() =>onHandleReply(reply.id)}
                            >
                                Reply
                            </Button>
                        </Tooltip>

                        {
                            user?.id === reply.author.id &&
                            <>
                                <Tooltip title="Delete">
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<EditOutlined />}
                                        onClick={() => onEditDiscussionReply(reply.id)}
                                    >Edit</Button>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <Button
                                        type="text"
                                        size="small"
                                        danger
                                        icon={<DeleteOutlined />}
                                        loading={actionStatus.loading === Status.LOADING}
                                        onClick={() => handleRemoveDisuccsionReply(reply.id)}
                                    >Delete</Button>
                                </Tooltip>
                            </>
                        }


                    </div>


                    {reply.replies?.length > 0 && (
                        <div className="mt-3 space-y-2 border-l-1 border-[#4096FF] pl-4">
                            {reply.replies.map((childReply: ISubjectDiscussionReply) => (
                                <div key={childReply.id} className="flex gap-2">
                                    {/* <Avatar size={28} /> */}
                                    <div>
                                        <p className="text-xs font-semibold">
                                            {childReply.author.name}
                                        </p>
                                        <p className="text-xs text-gray-700">
                                            {childReply.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}


                    {activeReplyId === reply.id && (
                        <div className="mt-3 space-y-2">
                            <Input
                                placeholder="Write a reply..."
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                            <div className="flex gap-2 mt-2">
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => handleSubmit(reply.id)}
                                    loading={actionStatus.status === Status.LOADING}
                                >
                                    Submit
                                </Button>
                                <Button size="small" onClick={() => setActiveReplyId(null)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                    {editReplyId === reply.id && (
                        <div className="mt-3 space-y-2">
                            <Input
                                placeholder="Write a reply..."
                                onChange={(e) => setReplyText(e.target.value)}
                                value={selectedSubjectDiscussionReply ? selectedSubjectDiscussionReply.content : ''}
                            />
                            <div className="flex gap-2 mt-2">
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => handleSubmit(reply.id)}
                                    loading={actionStatus.status === Status.LOADING}
                                >
                                    Submit
                                </Button>
                                <Button size="small" onClick={() => setEditReplyId(null)}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </Panel>
            ))}
        </Collapse>
    )
}
