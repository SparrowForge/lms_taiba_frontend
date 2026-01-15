"use client"

import { Card, Empty } from "antd"
import { useEffect, useState } from "react"

import { useSubjectDiscussionReplies } from "@/hooks/useSubjectDiscussionReplies"
import { useSubjectDiscussions } from "@/hooks/useSubjectDiscussions"

import { ISubjectDiscussion } from "@/types/subjectDiscussion"

import { MessageForm } from "./MessageForm"
import { MessageThread } from "./MessageThread"

export function DiscussionSection() {
  const { loadSubjectDiscussions, subjectDiscussions, loadSubjectDiscussion, selectedSubjectDiscussion } = useSubjectDiscussions()
  const { createSubjectDiscussionReply } = useSubjectDiscussionReplies()
  const [discussionId, setDiscussionId] = useState(0)
  const [parentReplyId, setParentReplyId] = useState("")
  const [replyContent, setReplyContent] = useState("")
  const [discussionReplyId, setDiscussionReplyId] = useState(null)

  // store message id that is being replied to
  const [replyingToId, setReplyingToId] = useState<number | null>(null)

  useEffect(() => {
    loadSubjectDiscussions({ page: 1, limit: 99 })
  }, [loadSubjectDiscussions])

  const handleReplyDiscussion = (messageId: number, text: string) => {
    setDiscussionId(messageId)
    setReplyContent(text)
  }

  useEffect(()=>{
    if(discussionReplyId){
      loadSubjectDiscussion(discussionReplyId)
    }
  },[discussionReplyId, loadSubjectDiscussion])

  const handleSubjectDiscussionReplySubmit = async() => {
    const data = {
      discussionId:Number(discussionId),
      parentReplyId: parentReplyId ? Number(parentReplyId) : null,
      content: replyContent,
      fileIds: [],
      status: "active"
    }
    await createSubjectDiscussionReply(data)
    setReplyContent("")
    window.location.reload();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      {/* New Message Form */}
      <Card className="border-0 shadow-sm">
        <MessageForm />
      </Card>

      {/* Message Threads */}
      {subjectDiscussions.length === 0 ? (
        <Card className="border-0 shadow-sm mt-4">
          <Empty
            description="No messages yet"
            style={{ marginTop: 48, marginBottom: 48 }}
          />
        </Card>
      ) : (
        <div className="space-y-4 mt-4">
          {subjectDiscussions.map((message: ISubjectDiscussion) => (
            <MessageThread
              onReplySubmit={handleSubjectDiscussionReplySubmit}
              key={message.id}
              message={message}
              isReplyOpen={replyingToId === message.id}
              onReplyClick={() => setReplyingToId(message.id)}
              onCancelReply={() => setReplyingToId(null)}
              onReply={handleReplyDiscussion}
              setDiscussionReplyId={setDiscussionReplyId}
              selectedSubjectDiscussion={selectedSubjectDiscussion}
            />
          ))}
        </div>
      )}
    </div>
  )
}
