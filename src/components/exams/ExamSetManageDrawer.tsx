'use client';

import { Button, Drawer, Radio, RadioChangeEvent, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status } from '@/enums';

import { useLocalization } from '@/hooks/useLocalization';
import { useQuestionSets } from '@/hooks/useQuestionSets';
import { useExams } from '@/hooks/useExams';
import { toast } from 'react-toastify';

interface StudentFormDrawerProps {
    mode: 'create' | 'edit';
    examId?: number;
    visible: boolean;
    onCancel: () => void;
    onSuccess: () => void;
}

const ExamSetManageDrawer: React.FC<StudentFormDrawerProps> = ({
    mode,
    examId,
    visible,
    onCancel,
    onSuccess
}) => {

    const [selectedQuestionSet, setSelectedQuestionSet] = useState<number | undefined>()
    const { questionSets, loadQuestionSets, detailsStatus, actionStatus } = useQuestionSets()
    const {createExamWithQuestionSet} = useExams()
    const { t } = useLocalization();
    const entityName = t(LOCALE_KEYS.QUESTION_SET, { defaultValue: 'Question set' });
    useEffect(() => {
        if (visible && examId) {
            //getStudentById(examId);
            loadQuestionSets({ page: 1, limit: 99, examId });
        }
    }, [visible, examId, loadQuestionSets]);


    const handleCancel = () => {
        onCancel();
    };

    if (mode === 'edit' && detailsStatus.status === Status.LOADING) {
        return <Spin />;
    }

    const finalQuestionSets = questionSets.map((item) => ({
        value: item.id,
        label: item.name
    }))
    const getSubmitText = () =>
        mode === 'create'
            ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
            : t(LOCALE_KEYS.UPDATE_NAME, { name: entityName });


    const onChange = (e: RadioChangeEvent) => {
        setSelectedQuestionSet(e.target.value);
    };

    const handleSubmit = async () =>{
        const data ={
            examId:Number(examId), 
            questionSetId: Number(selectedQuestionSet)
        }
        console.log(data)
        await createExamWithQuestionSet(data)
        toast.success(t(LOCALE_KEYS.SUCCESS_OPERATION))
        onSuccess()
    }

    return (
        <Drawer
            key={examId} // Force remount when examId changes
            title={
                mode === 'create'
                    ? t(LOCALE_KEYS.CREATE_NAME, { name: entityName })
                    : t(LOCALE_KEYS.EDIT_NAME, { name: entityName })
            }
            width={600}
            open={visible}
            onClose={handleCancel}
            destroyOnHidden={true}
            footer={
                <Space>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={actionStatus.status === Status.LOADING}
                        onClick={() => handleSubmit()}
                    >
                        {getSubmitText()}
                    </Button>
                    <Button
                        onClick={handleCancel}
                        disabled={actionStatus.status === Status.LOADING}
                    >
                        {t(LOCALE_KEYS.CANCEL)}
                    </Button>
                </Space>
            }
        >

            <Radio.Group
                value={selectedQuestionSet}
                onChange={onChange}
            >
                <Space direction="vertical">
                    {finalQuestionSets.map(item => (
                        <Radio key={item.value} value={item.value}>
                            {item.label}
                        </Radio>
                    ))}
                </Space>
            </Radio.Group>



        </Drawer>
    );
};

export default ExamSetManageDrawer;
