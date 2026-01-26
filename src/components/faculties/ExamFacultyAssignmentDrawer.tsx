'use client';

import {
  Button,
  Drawer,
  Select,
  Space,
  Spin,
  Checkbox,
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';

import { useFaculties } from '@/hooks/useFaculties';
import { useLocalization } from '@/hooks/useLocalization';
import { toast } from 'react-toastify';

interface FacultyAssignment {
  facultyId?: number;
  canCreateQuestionSet: boolean;
  canAddQuestions: boolean;
}

interface ExamFacultyAssignDrawerProps {
  visible: boolean;
  examId?: number;
  loading?: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const ExamFacultyAssignDrawer: React.FC<ExamFacultyAssignDrawerProps> = ({
  visible,
  examId,
  loading = false,
  onCancel,
  onSuccess
}) => {
  const { t } = useLocalization();
  const { loadFaculties, faculties, createExamFacultyAssignment } =
    useFaculties();

  const [rows, setRows] = useState<FacultyAssignment[]>([
    {
      facultyId: undefined,
      canCreateQuestionSet: false,
      canAddQuestions: false,
    },
  ]);

  useEffect(() => {
    loadFaculties({ page: 1, limit: 99 });
  }, [loadFaculties]);

  useEffect(() => {
    if (!visible) {
      setRows([
        {
          facultyId: undefined,
          canCreateQuestionSet: false,
          canAddQuestions: false,
        },
      ]);
    }
  }, [visible]);

  const facultyOptions = useMemo(
    () =>
      faculties.map((f) => ({
        label: f.fullName,
        value: f.id,
      })),
    [faculties]
  );

  const getAvailableOptions = (index: number) => {
    const selected = rows
      .map((r, i) => (i !== index ? r.facultyId : undefined))
      .filter(Boolean);

    return facultyOptions.filter(
      (opt) => !selected.includes(opt.value)
    );
  };

  const updateRow = (
    index: number,
    changes: Partial<FacultyAssignment>
  ) => {
    const updated = [...rows];
    updated[index] = { ...updated[index], ...changes };
    setRows(updated);
  };

  const addMore = () => {
    setRows([
      ...rows,
      {
        facultyId: undefined,
        canCreateQuestionSet: false,
        canAddQuestions: false,
      },
    ]);
  };

  const handleSubmit = async () => {
    if (!examId) return;

    const data = {
      examId,
      facultyAssignments: rows.filter(
        (r) => typeof r.facultyId === 'number'
      ),
    };

    await createExamFacultyAssignment(data);
    toast.success(t(LOCALE_KEYS.SUCCESS_OPERATION));
    onSuccess()
  };

  const isAddDisabled =
    getAvailableOptions(rows.length - 1).length === 0;

  return (
    <Drawer
      title={t(LOCALE_KEYS.ASSIGN_FACULTY, {
        defaultValue: 'Assign Faculties',
      })}
      width={650}
      open={visible}
      onClose={onCancel}
      destroyOnHidden
      footer={
        <Space>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={!rows.some((r) => r.facultyId)}
          >
            {t(LOCALE_KEYS.SUBMIT, { defaultValue: 'Submit' })}
          </Button>
          <Button onClick={onCancel}>
            {t(LOCALE_KEYS.CANCEL)}
          </Button>
        </Space>
      }
    >
      {loading ? (
        <Spin />
      ) : (
        <Space direction="vertical" style={{ width: '100%' }}>
          {rows.map((row, index) => (
            <Space
              key={index}
              direction="vertical"
              style={{
                width: '100%',
                padding: 12,
                border: '1px solid #f0f0f0',
                borderRadius: 8,
              }}
            >
              <Select
                style={{ width: '100%' }}
                placeholder="Select faculty"
                value={row.facultyId}
                options={getAvailableOptions(index)}
                onChange={(val) =>
                  updateRow(index, { facultyId: val })
                }
              />

              <Checkbox
                disabled={!row.facultyId}
                checked={row.canCreateQuestionSet}
                onChange={(e) =>
                  updateRow(index, {
                    canCreateQuestionSet: e.target.checked,
                  })
                }
              >
                Can create question set
              </Checkbox>

              <Checkbox
                disabled={!row.facultyId}
                checked={row.canAddQuestions}
                onChange={(e) =>
                  updateRow(index, {
                    canAddQuestions: e.target.checked,
                  })
                }
              >
                Can add questions
              </Checkbox>
            </Space>
          ))}

          <Button
            type="dashed"
            onClick={addMore}
            disabled={isAddDisabled}
          >
            + Add another faculty
          </Button>
        </Space>
      )}
    </Drawer>
  );
};

export default ExamFacultyAssignDrawer;
