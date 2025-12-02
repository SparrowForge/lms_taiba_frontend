import React, { useState } from 'react'

import QuestionSetForm from './QuestionSetForm'
import QuestionsTable from './QuestionsTable'

export interface FormState {
    name: string;
    descriptionText: string;
    status: string;
}


const QuestionSet = () => {
    const [selectedRow, setSelectedRow] = useState({})
    const [questionSetformData, setQuestionSetFormData] = useState<FormState>({
        name: "",
        descriptionText: "",
        status: "active",
    });
    const handleChange = (key: keyof FormState, value: string) => {
        setQuestionSetFormData(prev => ({ ...prev, [key]: value }));
    };


    return (
        <div>
            <QuestionSetForm formData={questionSetformData} setFormData={setQuestionSetFormData} changeHandler={handleChange}/>
            <QuestionsTable />
        </div>
    )
}

export default QuestionSet
