"use client"

import { useParams } from "next/navigation"
import { useEffect } from "react"

import { PiPrinter } from "react-icons/pi"
import { useQuestionSets } from "@/hooks/useQuestionSets"
import { Button, Card } from "antd"



export default function QuestionPaperPage() {
    const {id} = useParams()
    const { loadQuestionSet, selectedQuestionSet } = useQuestionSets()
    useEffect(()=>{
        if(id){
            loadQuestionSet(Number(id))
        }
    },[id, loadQuestionSet])
    const handlePrint = () => {
        window.print()
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const optionLabels = ["a", "b", "c", "d", "e", "f"]

    return (
        <div className="min-h-screen ">
            {/* Print Button - Hidden when printing */}
            <div className="print:hidden fixed top-4 right-4 z-50">
                <Button onClick={handlePrint} type="primary" className="gap-2">
                    <PiPrinter className="h-5 w-5" />
                    Print Question Paper
                </Button>
            </div>

            {/* Question Paper */}
            <div className="max-w-4xl mx-auto p-4 md:p-8 print:p-12 max-h-[calc(100vh-4rem)] overflow-y-auto print:max-h-none print:overflow-visible overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                {/* Header Section */}
                <div className="border-b-2 border-foreground pb-6 mb-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">{selectedQuestionSet?.course.name}</h1>
                        <p className="text-lg text-muted-foreground">Course Code: {selectedQuestionSet?.course.code}</p>
                    </div>

                    <div className="mt-6 border-t border-border pt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                            <div className="flex justify-between flex-wrap gap-2">
                                <span className="font-semibold">Exam:</span>
                                <span>{selectedQuestionSet?.exam.name}</span>
                            </div>
                            <div className="flex justify-between flex-wrap gap-2">
                                <span className="font-semibold">Total Marks:</span>
                                <span>{selectedQuestionSet?.exam.marks}</span>
                            </div>
                            <div className="flex justify-between flex-wrap gap-2">
                                <span className="font-semibold">Subject:</span>
                                <span>{selectedQuestionSet?.subject.name}</span>
                            </div>
                            <div className="flex justify-between flex-wrap gap-2">
                                <span className="font-semibold">Duration:</span>
                                <span>{selectedQuestionSet?.exam.duration.hours} Hours</span>
                            </div>
                            <div className="flex justify-between flex-wrap gap-2">
                                <span className="font-semibold">Subject Code:</span>
                                <span>{selectedQuestionSet?.subject.code}</span>
                            </div>
                            <div className="flex justify-between flex-wrap gap-2">
                                <span className="font-semibold">Questions:</span>
                                <span>{selectedQuestionSet?.exam.questionsCount}</span>
                            </div>
                            <div className="flex justify-between flex-wrap gap-2">
                                <span className="font-semibold">Batch:</span>
                                <span>{selectedQuestionSet?.batch.name}</span>
                            </div>
                            <div className="flex justify-between flex-wrap gap-2">
                                <span className="font-semibold">Date:</span>
                                <span>{formatDate(selectedQuestionSet?.exam.examDatetime)}</span>
                            </div>
                            <div className="flex justify-between flex-wrap gap-2">
                                <span className="font-semibold">Semester:</span>
                                <span>{selectedQuestionSet?.semester.name}</span>
                            </div>
                            <div className="flex justify-between flex-wrap gap-2">
                                <span className="font-semibold">Time:</span>
                                <span>{formatTime(selectedQuestionSet?.exam.examDatetime)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions Section */}
                <Card className="mb-8 p-3 md:p-6 bg-muted/30">
                    <h2 className="text-lg font-bold mb-3">Instructions:</h2>
                    <ul className="space-y-2 text-sm list-disc list-inside text-muted-foreground">
                        <li>Read all questions carefully before answering</li>
                        <li>All questions are compulsory</li>
                        <li>Choose the most appropriate answer for each question</li>
                        <li>Write your answers clearly in the answer sheet provided</li>
                        <li>No electronic devices are allowed during the examination</li>
                    </ul>
                </Card>

                {/* Student Information Section */}
                <div className="mb-8 p-3 md:p-6 border-2 border-dashed border-border rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                        <div>
                            <label className="text-sm font-semibold">Student Name:</label>
                            <div className="mt-1 border-b border-foreground pb-1"></div>
                        </div>
                        <div>
                            <label className="text-sm font-semibold">Roll Number:</label>
                            <div className="mt-1 border-b border-foreground pb-1"></div>
                        </div>
                    </div>
                </div>

                {/* Questions Section */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold border-b-2 border-foreground pb-3">Questions</h2>

                    {selectedQuestionSet?.items.map((item) => (
                        <div
                            key={item.order}
                            className={`space-y-3 pb-6 border-b border-border last:border-0 ${item.order % 10 === 0 && item.order !== selectedQuestionSet?.items.length ? "print:break-after-page" : ""
                                }`}
                        >
                            <div className="flex gap-3">
                                <span className="font-bold text-lg shrink-0">{item.order}.</span>
                                <p className="text-lg leading-relaxed">{item.question.questionText}</p>
                            </div>

                            <div className="ml-8 space-y-2.5">
                                {item.question.options.map((option, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <span className="font-medium shrink-0 w-6">{optionLabels[index]})</span>
                                        <span className="leading-relaxed">{option}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Answer space */}
                            <div className="ml-8 mt-4 print:block hidden">
                                <div className="text-sm font-semibold mb-1">Answer:</div>
                                <div className="border-b border-foreground w-24"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-12 pt-6 border-t-2 border-foreground text-center text-sm text-muted-foreground">
                    <p>End of Question Paper</p>
                    <p className="mt-2">
                        {selectedQuestionSet?.batch.session} • {selectedQuestionSet?.batch.academicYear}
                    </p>
                </div>
            </div>
        </div>
    )
}
