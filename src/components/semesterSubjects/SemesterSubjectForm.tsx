'use client';

import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Card, Col, Form, InputNumber, message, Row, Select, Space, Typography,} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';
import {Status} from '@/enums';

import {useBatches} from '@/hooks/useBatches';
import {useFaculties} from '@/hooks/useFaculties';
import {useLocalization} from '@/hooks/useLocalization';
import {useSemesters} from '@/hooks/useSemesters';
import {useSemesterSubjects} from '@/hooks/useSemesterSubjects';
import {useSubjects} from '@/hooks/useSubjects';

import {getErrorMessage} from '@/types/errors';
import {
    IFacultyAssignment,
    ISemesterSubjectCreate,
    ISemesterSubjectMultipleCreate,
    ISemesterSubjectUpdate,
} from '@/types/semesterSubject';

const { Text, Title } = Typography;

interface SemesterSubjectFormProps {
  mode: 'create' | 'edit';
  semesterSubjectId?: number;
  initialValues?: Partial<ISemesterSubjectCreate | ISemesterSubjectUpdate>;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const SemesterSubjectForm: React.FC<SemesterSubjectFormProps> = ({
  mode,
  semesterSubjectId,
  initialValues,
  onSuccess,
  onCancel,
  embedded = false,
}) => {
  const { t } = useLocalization();
  const entityName = t(LOCALE_KEYS.SEMESTER_SUBJECT, { defaultValue: 'Semester Subject' });
  const router = useRouter();
  const [form] = Form.useForm();

  // Hooks
  const {
    createSemesterSubject,
    createMultipleSemesterSubjects,
    editSemesterSubject,
    actionStatus,
    loadSemesterSubject,
  } = useSemesterSubjects();
  const { faculties, loadFaculties } = useFaculties();
  const { subjects, loadSubjects, listStatus: subjectsListStatus } = useSubjects();
  const { semesters, loadSemesters } = useSemesters();
  const { batches, loadBatches } = useBatches();

  // State for page mode (multiple faculty assignment)
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | undefined>();
  const [selectedBatchId, setSelectedBatchId] = useState<number | undefined>();
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>();
  const [filterBatchId, setFilterBatchId] = useState<number | undefined>();
  const [subjectAssignments, setSubjectAssignments] = useState<
    Array<{
      subjectId: number;
      faculty: IFacultyAssignment[];
    }>
  >([]);

  useEffect(() => {
    loadFaculties({ page: 1, limit: 100 });
    loadSemesters({ page: 1, limit: 100 });
    loadBatches({ page: 1, limit: 100 });
    // Don't load subjects upfront - load them dynamically after semester selection
  }, [loadFaculties, loadSemesters, loadBatches]);

  useEffect(() => {
    if (mode === 'edit' && semesterSubjectId) {
      loadSemesterSubject(semesterSubjectId);
    }
  }, [mode, semesterSubjectId, loadSemesterSubject]);

  useEffect(() => {
    if (mode === 'create') {
      form.resetFields();
      setSubjectAssignments([]);
      setSelectedSemesterId(undefined);
      setSelectedBatchId(undefined);
      setSelectedCourseId(undefined);
      setFilterBatchId(undefined);
    }
  }, [mode, form]);

  // Handle batch filter change
  const handleBatchFilterChange = (batchId: number | undefined) => {
    setFilterBatchId(batchId);
    // Reset semester selection when batch filter changes
    setSelectedSemesterId(undefined);
    setSelectedBatchId(undefined);
    setSelectedCourseId(undefined);
    setSubjectAssignments([]);
  };

  // Handle semester selection (page mode)
  const handleSemesterChange = async (semesterId: number) => {
    setSelectedSemesterId(semesterId);

    // Reset subject assignments when semester changes
    setSubjectAssignments([]);

    const selectedSemester = semesters.find((s) => s.id === semesterId);

    if (selectedSemester) {
      setSelectedBatchId(selectedSemester.batchId);
      const selectedBatch = batches.find((b) => b.id === selectedSemester.batchId);

      if (selectedBatch) {
        setSelectedCourseId(selectedBatch.courseId);

        // Load subjects for this specific course
        try {
          await loadSubjects({
            page: 1,
            limit: 100,
            //courseId: selectedBatch.courseId,
          });
        } catch (error) {
          console.error('Failed to load subjects for course:', error);
          message.error('Failed to load subjects for this course. Please try again.');
        }
      }
    }
  };

  // Get filtered semesters by batch
  const getFilteredSemesters = () => {
    if (!filterBatchId) {
      return []; // Show no semesters until batch is selected
    }
    return semesters.filter((semester) => semester.batchId === filterBatchId);
  };

  // Get filtered subjects by course
  const getFilteredSubjects = () => {
    if (!selectedCourseId) {
      return [];
    }

    if (subjects.length === 0) {
      return [];
    }

    // Since we're now loading subjects by course ID, all loaded subjects should match
    // But let's still filter to be safe
    //filter by courseId
    // const filtered = subjects.filter((subject) => {
    //   return subject.courseId === selectedCourseId;
    // });

    return subjects;
  };

  // Get available subjects (excluding already selected ones)
  const getAvailableSubjects = () => {
    const filteredSubjects = getFilteredSubjects();
    const selectedSubjectIds = subjectAssignments.map((assignment) => assignment.subjectId);
    const available = filteredSubjects.filter(
      (subject) => !selectedSubjectIds.includes(subject.id),
    );

    // Also include currently selected subjects so they show in their own dropdowns
    const currentSubject = filteredSubjects.find((s) => s.id === selectedSubjectIds[0]);
    if (currentSubject && !available.find((s) => s.id === currentSubject.id)) {
      available.push(currentSubject);
    }

    return available;
  };

  // Get subjects for a specific dropdown (including the currently selected one)
  const getSubjectsForDropdown = (currentSubjectId: number) => {
    const filteredSubjects = getFilteredSubjects();
    const selectedSubjectIds = subjectAssignments.map((assignment) => assignment.subjectId);

    // Include the current subject plus all unselected ones
    const available = filteredSubjects.filter(
      (subject) => subject.id === currentSubjectId || !selectedSubjectIds.includes(subject.id),
    );

    return available;
  };

  // Check if we can add more subjects
  const canAddSubject = () => {
    if (!filterBatchId) return false; // Batch must be selected first
    if (!selectedSemesterId) return false;
    if (!selectedCourseId) return false;
    if (subjects.length === 0) return false; // Subjects not loaded yet

    // Check if there are any subjects that haven't been assigned yet
    const filteredSubjects = getFilteredSubjects();
    const selectedSubjectIds = subjectAssignments.map((assignment) => assignment.subjectId);
    const unassignedSubjects = filteredSubjects.filter(
      (subject) => !selectedSubjectIds.includes(subject.id),
    );

    return unassignedSubjects.length > 0;
  };

  // Validate faculty assignments for a subject (optional)
  const validateFacultyAssignment = (faculty: IFacultyAssignment) => {
    // Faculty assignment is optional - if any field is filled, all should be filled
    if (faculty.facultyId > 0 || faculty.hoursPerWeek > 0 || faculty.role.trim() !== '') {
      return faculty.facultyId > 0 && faculty.hoursPerWeek > 0 && faculty.role.trim() !== '';
    }
    return true; // Empty faculty assignment is valid
  };

  // Check if all subjects have valid faculty assignments
  const validateAllAssignments = () => {
    if (!filterBatchId) return false; // Batch must be selected first
    if (subjectAssignments.length === 0) return false;

    return subjectAssignments.every((assignment) => {
      // Faculty assignment is optional - just ensure the subject is selected
      return assignment.subjectId > 0;
    });
  };

  // Get validation errors for display
  const getValidationErrors = () => {
    const errors: string[] = [];

    subjectAssignments.forEach((assignment, index) => {
      const subjectName = getSubjectName(assignment.subjectId);

      // Only validate faculty assignments if they are partially filled
      const hasPartialFaculty = assignment.faculty.some(
        (faculty) =>
          faculty.facultyId > 0 || faculty.hoursPerWeek > 0 || faculty.role.trim() !== '',
      );

      if (hasPartialFaculty) {
        const validFacultyCount = assignment.faculty.filter((faculty) =>
          validateFacultyAssignment(faculty),
        ).length;
        if (validFacultyCount === 0) {
          errors.push(
            `${subjectName}: Faculty assignment incomplete (need faculty, hours, and role)`,
          );
        }
      }
    });

    return errors;
  };

  // Add new subject assignment
  const addSubjectAssignment = () => {
    const availableSubjects = getAvailableSubjects();

    if (availableSubjects.length === 0) {
      message.warning('No more subjects available for this course');
      return;
    }

    const newAssignment = {
      subjectId: availableSubjects[0].id,
      faculty: [], // Start with no faculty assignments
    };

    setSubjectAssignments([...subjectAssignments, newAssignment]);
  };

  // Remove subject assignment
  const removeSubjectAssignment = (index: number) => {
    setSubjectAssignments(subjectAssignments.filter((_, i) => i !== index));
  };

  // Add faculty to subject
  const addFacultyToSubject = (subjectIndex: number) => {
    const newAssignments = [...subjectAssignments];
    // Initialize faculty array if it doesn't exist
    if (!newAssignments[subjectIndex].faculty) {
      newAssignments[subjectIndex].faculty = [];
    }
    newAssignments[subjectIndex].faculty.push({
      facultyId: 0,
      hoursPerWeek: 0,
      role: '',
    });
    setSubjectAssignments(newAssignments);
  };

  // Remove faculty from subject
  const removeFacultyFromSubject = (subjectIndex: number, facultyIndex: number) => {
    const newAssignments = [...subjectAssignments];
    newAssignments[subjectIndex].faculty.splice(facultyIndex, 1);
    // Allow faculty array to be empty since it's optional
    setSubjectAssignments(newAssignments);
  };

  // Update subject assignment
  const updateSubjectAssignment = (
    index: number,
    field: 'subjectId' | 'faculty',
    value: any,
    facultyIndex?: number,
  ) => {
    const newAssignments = [...subjectAssignments];
    if (field === 'subjectId') {
      newAssignments[index].subjectId = value;
      // Reset faculty assignments for new subject
      newAssignments[index].faculty = [];
    } else if (field === 'faculty' && facultyIndex !== undefined) {
      newAssignments[index].faculty[facultyIndex] = {
        ...newAssignments[index].faculty[facultyIndex],
        ...value,
      };
    }

    setSubjectAssignments(newAssignments);
  };

  // Get subject name by ID
  const getSubjectName = (subjectId: number) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? `${subject.name} (${subject.code})` : 'Unknown Subject';
  };

  // Get faculty name by ID
  const getFacultyName = (facultyId: number) => {
    const faculty = faculties.find((f) => f.id === facultyId);
    return faculty ? faculty.fullName : 'Unknown Faculty';
  };

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      if (embedded) {
        // Drawer mode - single semester subject creation (existing functionality)
        if (mode === 'create') {
          await createSemesterSubject(values as ISemesterSubjectCreate);
        } else {
          await editSemesterSubject(semesterSubjectId!, values as ISemesterSubjectUpdate);
        }
      } else {
        // Page mode - multiple semester subjects with faculty assignments
        if (mode === 'create' && subjectAssignments.length > 0) {
          const payload: ISemesterSubjectMultipleCreate = {
            semesterId: selectedSemesterId!,
            subjects: subjectAssignments.map((assignment) => ({
              subjectId: assignment.subjectId,
              faculty: assignment.faculty.filter(
                (f) => f.facultyId > 0 && f.hoursPerWeek > 0 && f.role.trim() !== '',
              ), // Only include complete faculty assignments
            })),
          };
          await createMultipleSemesterSubjects(payload);
        }
      }

      toast.success(`${mode === 'create' ? 'Created' : 'Updated'} successfully`);

      if (onSuccess) {
        onSuccess();
      } else if (!embedded) {
        // Add a small delay to ensure the success message is visible
        setTimeout(() => {
          try {
            // Try router.push first
            router.push('/semester-subjects');
          } catch (routerError) {
            console.error('Router push failed, trying window.location:', routerError);
            // Fallback to window.location
            window.location.href = '/semester-subjects';
          }
        }, 1000); // 1 second delay
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(getErrorMessage(error));
    }
  };

  // Form content for drawer mode (single assignment)
  const drawerFormContent = (
    <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={initialValues}>
      <Form.Item
        label={t(LOCALE_KEYS.SEMESTER, { defaultValue: 'Semester' })}
        name="semesterId"
        rules={[{ required: true, message: 'Please select a semester' }]}
      >
        <Select placeholder="Select semester">
          {semesters.map((semester) => (
            <Select.Option key={semester.id} value={semester.id}>
              {semester.name} - {semester.batch?.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={t(LOCALE_KEYS.SUBJECT, { defaultValue: 'Subject' })}
        name="subjectId"
        rules={[{ required: true, message: 'Please select a subject' }]}
      >
        <Select placeholder="Select subject">
          {subjects.map((subject) => (
            <Select.Option key={subject.id} value={subject.id}>
              {subject.name} ({subject.code})
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={actionStatus.status === Status.LOADING}>
            {mode === 'create' ? 'Create' : 'Update'}
          </Button>
          {onCancel && <Button onClick={onCancel}>Cancel</Button>}
        </Space>
      </Form.Item>
    </Form>
  );

  // Form content for page mode (multiple assignments)
  const pageFormContent = (
    <div style={{ padding: '24px', height: 'calc(100vh - 128px)', overflow: 'auto' }}>
      <Row gutter={24}>
        <Col span={12}>
          <Card
            title={`${mode === 'create' ? 'Create' : 'Edit'} ${entityName}`}
            style={{ height: 'fit-content' }}
            size="small"
          >
            {/* Batch Filter */}
            <Form.Item label="Select Batch (Required)" required style={{ marginBottom: 16 }}>
              <Select
                placeholder="Select a batch to continue"
                value={filterBatchId}
                onChange={handleBatchFilterChange}
                style={{ width: '100%' }}
                loading={batches.length === 0}
                showSearch
                filterOption={(input, option) =>
                  (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                }
                optionLabelProp="label"
              >
                {batches.map((batch) => (
                  <Select.Option
                    key={batch.id}
                    value={batch.id}
                    label={`${batch.name} - ${batch.course?.name}`}
                  >
                    {batch.name} - {batch.course?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Semester Selection */}
            <Form.Item label={t(LOCALE_KEYS.SEMESTER, { defaultValue: 'Semester' })} required>
              <Select
                placeholder={
                  filterBatchId
                    ? `Select semester from ${batches.find((b) => b.id === filterBatchId)?.name}`
                    : 'Please select a batch first'
                }
                value={selectedSemesterId}
                onChange={handleSemesterChange}
                style={{ width: '100%' }}
                loading={semesters.length === 0}
                disabled={!filterBatchId}
              >
                {getFilteredSemesters().map((semester) => (
                  <Select.Option key={semester.id} value={semester.id}>
                    {semester.name} - {semester.batch?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Semester Count Info */}
            <div
              style={{ marginBottom: 16, padding: 8, borderRadius: 4, border: '1px solid #d9d9d9' }}
            >
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {filterBatchId
                  ? `Showing ${getFilteredSemesters().length} semester${getFilteredSemesters().length !== 1 ? 's' : ''} for ${batches.find((b) => b.id === filterBatchId)?.name}`
                  : 'Please select a batch to see available semesters'}
              </Text>
            </div>

            {/* No Batch Selected Message */}
            {!filterBatchId && (
              <div
                style={{
                  marginBottom: 16,
                  padding: 8,
                  borderRadius: 4,
                  border: '1px solid #d9d9d9',
                }}
              >
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  📋 Select a batch first to see available semesters and subjects
                </Text>
              </div>
            )}

            {/* No Semesters Message for Selected Batch */}
            {filterBatchId && getFilteredSemesters().length === 0 && semesters.length > 0 && (
              <div
                style={{
                  marginBottom: 16,
                  padding: 8,
                  borderRadius: 4,
                  border: '1px solid #ffd591',
                }}
              >
                <Text type="warning" style={{ fontSize: '12px' }}>
                  No semesters found for the selected batch. Try selecting a different batch or
                  clear the filter.
                </Text>
              </div>
            )}

            {/* Course and Batch Info */}
            {selectedSemesterId && selectedBatchId && selectedCourseId && (
              <div
                style={{
                  marginBottom: 16,
                  padding: 12,
                  borderRadius: 6,
                  border: '1px solid #b7eb8f',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div>
                    <Text strong>Course: </Text>
                    <Text>{batches.find((b) => b.id === selectedBatchId)?.course?.name}</Text>
                    <br />
                    <Text strong>Batch: </Text>
                    <Text>{batches.find((b) => b.id === selectedBatchId)?.name}</Text>
                  </div>
                </div>
              </div>
            )}

            {/* Add Subject Button */}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addSubjectAssignment}
              disabled={!canAddSubject()}
              loading={subjectsListStatus.status === Status.LOADING}
              style={{ width: '100%', marginBottom: 16, height: '40px' }}
            >
              {subjectsListStatus.status === Status.LOADING
                ? 'Loading Subjects...'
                : `Add Subject (${(() => {
                    const filteredSubjects = getFilteredSubjects();
                    const selectedSubjectIds = subjectAssignments.map(
                      (assignment) => assignment.subjectId,
                    );
                    const unassignedSubjects = filteredSubjects.filter(
                      (subject) => !selectedSubjectIds.includes(subject.id),
                    );
                    return unassignedSubjects.length;
                  })()} available)`}
            </Button>

            <div style={{ marginBottom: 16, padding: 8, borderRadius: 4 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                💡 Faculty assignments are optional. You can assign faculty later or leave them
                empty.
              </Text>
            </div>

            {/* No Subjects Message */}
            {selectedCourseId &&
              subjects.length === 0 &&
              subjectsListStatus.status === Status.SUCCESS && (
                <div
                  style={{
                    marginBottom: 16,
                    padding: 12,
                    borderRadius: 6,
                    border: '1px solid #ffd591',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Text type="warning" style={{ fontSize: '16px' }}>
                      ⚠️
                    </Text>
                    <div>
                      <Text type="warning" strong>
                        No subjects available
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        No subjects found for this course. Please ensure subjects are assigned to
                        the course first.
                      </Text>
                    </div>
                  </div>
                </div>
              )}

            {/* Submit Button */}
            <Button
              type="primary"
              htmlType="submit"
              loading={actionStatus.status === Status.LOADING}
              disabled={!validateAllAssignments()}
              style={{ width: '100%', height: '40px', fontSize: '16px' }}
              onClick={() => {
                if (subjectAssignments.length === 0) {
                  message.warning('Please add at least one subject before submitting.');
                  return;
                }
                handleSubmit({});
              }}
            >
              {actionStatus.status === Status.LOADING
                ? 'Creating...'
                : `Create ${subjectAssignments.length} Semester Subject${subjectAssignments.length !== 1 ? 's' : ''}`}
            </Button>

            {/* Validation Errors */}
            {subjectAssignments.length > 0 && !validateAllAssignments() && (
              <div
                style={{ marginTop: 16, padding: 12, borderRadius: 4, border: '1px solid #ffccc7' }}
              >
                <Text type="danger" strong>
                  Please fix the following issues:
                </Text>
                {getValidationErrors().map((error, index) => (
                  <div key={index} style={{ marginTop: 4 }}>
                    <Text type="danger">• {error}</Text>
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            {subjectAssignments.length > 0 && (
              <Card title="Summary" style={{ marginTop: 16 }} size="small">
                <Row gutter={16}>
                  <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                      <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                        {subjectAssignments.length}
                      </Text>
                      <br />
                      <Text type="secondary">Subjects</Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'center' }}>
                      <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                        {subjectAssignments.reduce(
                          (total, assignment) => total + assignment.faculty.length,
                          0,
                        )}
                      </Text>
                      <br />
                      <Text type="secondary">Faculty Assignments</Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            )}
          </Card>
        </Col>

        <Col span={12}>
          {/* Subject Assignments */}
          {subjectAssignments.length === 0 ? (
            <Card
              title="No Subjects Added"
              style={{ marginBottom: 16, textAlign: 'center' }}
              size="small"
            >
              <div style={{ padding: '24px 16px' }}>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  Select a semester first, then add subjects to get started.
                </Text>
              </div>
            </Card>
          ) : (
            subjectAssignments.map((assignment, subjectIndex) => (
              <Card
                key={subjectIndex}
                title={
                  assignment.subjectId
                    ? getSubjectName(assignment.subjectId)
                    : `Subject ${subjectIndex + 1}`
                }
                style={{ marginBottom: 16 }}
                size="small"
                extra={
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeSubjectAssignment(subjectIndex)}
                  />
                }
              >
                {/* Subject Selection */}
                <Form.Item label={t(LOCALE_KEYS.SUBJECT, { defaultValue: 'Subject' })} required>
                  <Select
                    key={`subject-${subjectIndex}-${assignment.subjectId}`}
                    value={assignment.subjectId ? String(assignment.subjectId) : undefined}
                    onChange={(value) => {
                      // Convert string back to number for storage
                      const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
                      updateSubjectAssignment(subjectIndex, 'subjectId', numericValue);
                    }}
                    placeholder="Select subject"
                    style={{ width: '100%' }}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                    optionLabelProp="label"
                  >
                    {getSubjectsForDropdown(assignment.subjectId || 0).map((subject) => (
                      <Select.Option
                        key={subject.id}
                        value={String(subject.id)}
                        label={`${subject.name} (${subject.code}) - ${subject.creditHours} credits`}
                      >
                        {subject.name} ({subject.code}) - {subject.creditHours} credits
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Faculty Assignments */}
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Text strong>Faculty Assignments</Text>
                    <Button
                      type="dashed"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() => addFacultyToSubject(subjectIndex)}
                    >
                      Add Faculty
                    </Button>
                  </div>

                  {/* Faculty Assignment Status */}
                  {assignment.faculty.length > 0 &&
                    assignment.faculty.some(
                      (f) => f.facultyId > 0 || f.hoursPerWeek > 0 || f.role.trim() !== '',
                    ) && (
                      <div
                        style={{
                          marginBottom: 8,
                          padding: 8,
                          borderRadius: 6,
                          border: `1px solid ${assignment.faculty.some((f) => validateFacultyAssignment(f)) ? '#b7eb8f' : '#ffccc7'}`,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Text
                            type={
                              assignment.faculty.some((f) => validateFacultyAssignment(f))
                                ? 'success'
                                : 'danger'
                            }
                            style={{ fontSize: '14px' }}
                          >
                            {assignment.faculty.some((f) => validateFacultyAssignment(f))
                              ? '✓'
                              : '⚠'}
                          </Text>
                          <Text
                            type={
                              assignment.faculty.some((f) => validateFacultyAssignment(f))
                                ? 'success'
                                : 'danger'
                            }
                            style={{ fontSize: '12px' }}
                          >
                            {assignment.faculty.some((f) => validateFacultyAssignment(f))
                              ? 'Faculty assignment complete'
                              : 'Faculty assignment incomplete - need faculty, hours, and role'}
                          </Text>
                        </div>
                      </div>
                    )}

                  {/* No Faculty Message */}
                  {assignment.faculty.length === 0 && (
                    <div
                      style={{
                        marginBottom: 16,
                        padding: 12,
                        borderRadius: 6,
                        border: '1px solid #d9d9d9',
                      }}
                    >
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        No faculty assigned yet. Click "Add Faculty" to assign faculty members.
                      </Text>
                    </div>
                  )}

                  {assignment.faculty.map((faculty, facultyIndex) => (
                    <Row key={facultyIndex} gutter={16} style={{ marginBottom: 16 }}>
                      <Col span={8}>
                        <Form.Item
                          label="Faculty"
                          style={{ marginBottom: 0 }}
                          labelCol={{ span: 24 }}
                          wrapperCol={{ span: 24 }}
                        >
                          <Select
                            value={faculty.facultyId ? String(faculty.facultyId) : undefined}
                            onChange={(value) => {
                              const numericValue =
                                typeof value === 'string' ? parseInt(value, 10) : value;
                              updateSubjectAssignment(
                                subjectIndex,
                                'faculty',
                                { facultyId: numericValue },
                                facultyIndex,
                              );
                            }}
                            placeholder="Select faculty"
                            style={{ width: '100%' }}
                            showSearch
                            loading={faculties.length === 0}
                            filterOption={(input, option) =>
                              (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
                            }
                            optionLabelProp="label"
                          >
                            {faculties.map((facultyMember) => (
                              <Select.Option
                                key={facultyMember.id}
                                value={String(facultyMember.id)}
                                label={`${facultyMember.fullName} - ${facultyMember.department?.name}`}
                              >
                                {facultyMember.fullName} - {facultyMember.department?.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label="Hours/Week"
                          style={{ marginBottom: 0 }}
                          labelCol={{ span: 24 }}
                          wrapperCol={{ span: 24 }}
                        >
                          <InputNumber
                            value={faculty.hoursPerWeek || undefined}
                            onChange={(value) =>
                              updateSubjectAssignment(
                                subjectIndex,
                                'faculty',
                                { hoursPerWeek: value },
                                facultyIndex,
                              )
                            }
                            placeholder="Hours/week"
                            min={1}
                            max={40}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label="Role"
                          style={{ marginBottom: 0 }}
                          labelCol={{ span: 24 }}
                          wrapperCol={{ span: 24 }}
                        >
                          <Select
                            value={faculty.role || undefined}
                            onChange={(value) =>
                              updateSubjectAssignment(
                                subjectIndex,
                                'faculty',
                                { role: value },
                                facultyIndex,
                              )
                            }
                            placeholder="Select role"
                            style={{ width: '100%' }}
                          >
                            <Select.Option value="Primary Instructor">
                              Primary Instructor
                            </Select.Option>
                            <Select.Option value="Lab Instructor">Lab Instructor</Select.Option>
                            <Select.Option value="Tutorial Assistant">
                              Tutorial Assistant
                            </Select.Option>
                            <Select.Option value="Co-Instructor">Co-Instructor</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <div style={{ paddingTop: 32 }}>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeFacultyFromSubject(subjectIndex, facultyIndex)}
                          />
                        </div>
                      </Col>
                    </Row>
                  ))}
                </div>
              </Card>
            ))
          )}
        </Col>
      </Row>
    </div>
  );

  // Return appropriate form based on embedded prop
  if (embedded) {
    return drawerFormContent;
  }

  return pageFormContent;
};

export default SemesterSubjectForm;
