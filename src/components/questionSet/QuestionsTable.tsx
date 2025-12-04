
import { Checkbox, Table, Alert, Button, Card, Select, Row, Col, Spin } from "antd"
import { useEffect, useState } from "react"

import { LOCALE_KEYS } from "@/constants/localizationKeys"
import { DIFFICULTY_LEVEL_OPTIONS } from "@/enums/difficulty-level.enum"

import { useFaculties } from "@/hooks/useFaculties"
import { useLocalization } from "@/hooks/useLocalization"

import { IMCQQuestion } from "@/types/mcqQuestion"

import QuestionSetDrawer from "./QuestionSetDrawer"
import { IQuestionSetCreate } from "@/types/questionSet"
import { useQuestionSets } from "@/hooks/useQuestionSets"
import { Status } from "@/enums"

interface Question {
  id: number
  examId: number
  questionOrder: number
  questionText: string
  correctOptionNumber: number
  options: string[]
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
  deletedAt: null | string
}

interface QuestionsTableProps {
  questions: IMCQQuestion[]
  selectedQuestions: number[]
  setSelectedQuestion: (ids: number[]) => void,
  onSubmit?: () => void
}

export default function QuestionsTable({ questions, selectedQuestions, setSelectedQuestion, onSubmit }: QuestionsTableProps) {
  const { t } = useLocalization()
  const { faculties, loadFaculties } = useFaculties()
  const [selectedFaculty, setSelectedFaculty] = useState({})
  const [difficultyLevel, setDifficultyLevel] = useState({})
  const { actionStatus} = useQuestionSets()

  useEffect(() => {
    loadFaculties({ page: 1, limit: 99 })
  }, [loadFaculties])

  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
  const handleCreateDrawer = () => {
    setDrawerVisible(true);
  };

  const handleDrawerSuccess = () => {
    setDrawerVisible(false);
  };


  const handleCheckboxChange = (questionId: number) => {
    const newSelected = selectedQuestions.includes(questionId)
      ? selectedQuestions.filter((id) => id !== questionId)
      : [...selectedQuestions, questionId]

    setSelectedQuestion(newSelected)
  }

  const handleSelectAll = (e: any) => {
    if (e.target.checked) {
      setSelectedQuestion(questions.map((q) => q.id))
    } else {
      setSelectedQuestion([])
    }
  }

  const isAllSelected = selectedQuestions.length === questions.length
  const isIndeterminate = selectedQuestions.length > 0 && selectedQuestions.length < questions.length
  const showWarning = selectedQuestions.length >= 20

  const columns = [
    {
      title: <Checkbox indeterminate={isIndeterminate} checked={isAllSelected} onChange={handleSelectAll} />,
      key: "checkbox",
      width: 60,
      render: (_: any, record: Question) => (
        <Checkbox checked={selectedQuestions.includes(record.id)} onChange={() => handleCheckboxChange(record.id)} />
      ),
    },
    {
      title: "Question",
      dataIndex: "questionText",
      key: "questionText",
      ellipsis: true,
      render: (text: string) => <span >{text}</span>,
    },
    {
      title: "Correct Option",
      dataIndex: "correctOptionNumber",
      key: "correctOptionNumber",
      width: 130,
      render: (number: number, record: Question) => (
        <span className="font-medium text-primary">
          Option {number}: {record.options[number - 1]}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <p
          className="text-semibold"
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </p>
      ),
    },
  ]

  return (
    <Card style={{ margin: '8px',  height: "60vh", overflowY: "auto" }}>
      <Card className="">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <label className="block text-sm font-medium  mb-2">Faculty</label>
            <Select
              value={selectedFaculty?.fullName}
              onChange={(e) => setSelectedFaculty(e)}
              className="w-full"
              placeholder={t(LOCALE_KEYS.FACULTY)}
            >
              <option value="">All Faculty</option>
              {faculties.map((item) => (
                <option key={item.branchId} value={item.fullName}>
                  {item.fullName}
                </option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={6}>
            <label className="block text-sm font-medium  mb-2">Difficulty Level</label>
            <Select
              value={difficultyLevel?.label}
              onChange={(e) => setDifficultyLevel(e)}
              placeholder={t(LOCALE_KEYS.PLEASE_SELECT_STATUS)}
              options={DIFFICULTY_LEVEL_OPTIONS}
              className="w-full"
            />
          </Col>
        </Row>
      </Card>

      <div className="flex justify-between mr-10">
        <div className="relative">
          <Button
            style={{ margin: "16px 0" }}
            type="primary"
            onClick={() => handleCreateDrawer()}
          >
            Selected: {selectedQuestions.length}
          </Button>
        </div>
        <div className="relative">
          <Button
            style={{ margin: "16px 0" }}
            type="primary"
            onClick={() => onSubmit()}
          >
            {actionStatus.status === Status.LOADING ? <Spin /> : 'Submit'}
          </Button>
        </div>
      </div>

      {showWarning && (
        <Alert
          message="Warning"
          description={`You have selected ${selectedQuestions.length} questions. The maximum recommended is 20.`}
          type="warning"
          showIcon
          closable
          className="mb-4"
        />
      )}

      <div className="overflow-x-auto ">
        <Table
          columns={columns}
          dataSource={questions}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 800 }}

          size="middle"
        />
      </div>


      <QuestionSetDrawer
        onCancel={() => setDrawerVisible(false)}
        onSuccess={handleDrawerSuccess}
        visible={drawerVisible} />
    </Card>
  )
}
