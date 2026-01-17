"use client"

import { OpenAIOutlined } from "@ant-design/icons"
import { Button, Card, Empty } from "antd"
import { useEffect, useState } from "react"

import { useSubjectDiscussionReplies } from "@/hooks/useSubjectDiscussionReplies"
import { useSubjectDiscussions } from "@/hooks/useSubjectDiscussions"

import { ISubjectDiscussion } from "@/types/subjectDiscussion"

import DiscussionFormDrawer from "./DiscussionFormDrawer"
import { MessageThread } from "./MessageThread"

export function DiscussionSection() {
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedDiscussionId, setSelectedDiscussionId] = useState<number | undefined>()
  const { loadSubjectDiscussions, subjectDiscussions, loadSubjectDiscussion, selectedSubjectDiscussion } = useSubjectDiscussions()

  const { createSubjectDiscussionReply, } = useSubjectDiscussionReplies()
  const [discussionId, setDiscussionId] = useState(0)
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

  const handleEditDrawer = (discussionId: number) => {
    setSelectedDiscussionId(discussionId);
    setDrawerMode('edit');
    setDrawerVisible(true);
  };

  const handleCreateDrawer = () => {
    setSelectedDiscussionId(undefined);
    setDrawerMode('create');
    setDrawerVisible(true);
  };

  useEffect(() => {
    if (discussionReplyId) {
      loadSubjectDiscussion(discussionReplyId)
    }
  }, [discussionReplyId, loadSubjectDiscussion, replyContent])

  const handleSubjectDiscussionReplySubmit = async () => {
    const data = {
      discussionId: Number(discussionId),
      parentReplyId: null,
      content: replyContent,
      fileIds: [],
      status: "active"
    }
    await createSubjectDiscussionReply(data)
    setReplyContent("")
    setReplyingToId(null)
  }

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
  };

  return (
    <>
      <div className="flex justify-end m-4">
        <Button
          htmlType="submit"
          type="primary"
          icon={<OpenAIOutlined />}
          onClick={() => handleCreateDrawer()}
        >
          Open Discussion
        </Button>
      </div>
      <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">


        <DiscussionFormDrawer
          mode={drawerMode}
          discussionId={selectedDiscussionId}
          visible={drawerVisible}
          onCancel={() => setDrawerVisible(false)}
          onSuccess={handleDrawerSuccess}
        />


        {subjectDiscussions.length === 0 ? (
          <Card className="border-0 shadow-sm mt-4">
            <Empty
              description="No discussion yet, open your first discussion"
              style={{ marginTop: 48, marginBottom: 48 }}
            />
          </Card>
        ) : (
          <div className="">
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
                onEditDrawer={handleEditDrawer}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
