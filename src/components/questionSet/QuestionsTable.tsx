
import { Checkbox, Table, Alert, Button, Card, Select, Row, Col } from "antd"
import { useState } from "react"

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
  questions: Question[]
  selectedQuestions: number[]
  setSelectedQuestion: (ids: number[]) => void
}

export default function QuestionsTable({ questions, selectedQuestions, setSelectedQuestion }: QuestionsTableProps) {
  const [expandedRows, setExpandedRows] = useState<number[]>([])

  const [filters, setFilters] = useState({
    course: "",
    batch: "",
    semester: "",
    subject: "",
  })

  const uniqueCourses = Array.from(new Set(questions.map((q) => q.course).filter(Boolean)))
  const uniqueBatches = Array.from(new Set(questions.map((q) => q.batch).filter(Boolean)))
  const uniqueSemesters = Array.from(new Set(questions.map((q) => q.semester).filter(Boolean)))
  const uniqueSubjects = Array.from(new Set(questions.map((q) => q.subject).filter(Boolean)))

  const filteredQuestions = questions.filter((q) => {
    return (
      (!filters.course || q.course === filters.course) &&
      (!filters.batch || q.batch === filters.batch) &&
      (!filters.semester || q.semester === filters.semester) &&
      (!filters.subject || q.subject === filters.subject)
    )
  })

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
    <Card style={{ margin: '8px' }}>
      <Card className="">
        <Row gutter={[16,16]}>
          <Col xs={24} sm={6}>
            <label className="block text-sm font-medium  mb-2">Course</label>
            <Select
              value={filters.course}
              onChange={(e) => setFilters({ ...filters, course: e.target.value })}
              className="w-full"
            >
              <option value="">All Courses</option>
              {uniqueCourses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={6}>
            <label className="block text-sm font-medium  mb-2">Batch</label>
            <Select
              value={filters.batch}
              onChange={(e) => setFilters({ ...filters, batch: e.target.value })}
              className="w-full"
            >
              <option value="">All Batches</option>
              {uniqueBatches.map((batch) => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={6}>
            <label className="block text-sm font-medium  mb-2">Semester</label>
            <Select
              value={filters.semester}
              onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
              className="w-full"
            >
              <option value="">All Semesters</option>
              {uniqueSemesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={6}>
            <label className="block text-sm font-medium  mb-2">Subject</label>
            <Select
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
              className="w-full"
            >
              <option value="">All Subjects</option>
              {uniqueSubjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </Select>
          </Col>
        </Row>

        {Object.values(filters).some((v) => v) && (
          <div className="mt-3 text-sm text-muted-foreground">
            Showing {filteredQuestions.length} of {questions.length} questions
          </div>
        )}
      </Card>
      <div className="flex justify-end mr-10">
        <div className="relative">
          <Button
            style={{margin:"16px 0"}}
            type="primary"
          >
            Selected: {selectedQuestions.length}
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

      {/* {selectedQuestions.length > 0 && (
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium text-muted-foreground mb-2">Selected Question IDs:</p>
          <div className="flex flex-wrap gap-2">
            {selectedQuestions.map((id) => (
              <span key={id} className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                #{id}
              </span>
            ))}
          </div>
        </div>
      )} */}
    </Card>
  )
}
