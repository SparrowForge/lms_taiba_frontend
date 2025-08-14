'use client';

import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Card, Col, Form, InputNumber, message, Row, Select, Space, Typography} from 'antd';
import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {toast} from 'react-toastify';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useBatches} from '@/hooks/useBatches';
import {useFaculties} from '@/hooks/useFaculties';
import {useLocalization} from '@/hooks/useLocalization';
import {useSemesters} from '@/hooks/useSemesters';
import {useSemesterSubjects} from '@/hooks/useSemesterSubjects';
import {useSubjects} from '@/hooks/useSubjects';

import {Status} from '@/types/common';
import {getErrorMessage} from '@/types/errors';
import {
    IFacultyAssignment,
    ISemesterSubjectCreate,
    ISemesterSubjectMultipleCreate,
    ISemesterSubjectUpdate
} from '@/types/semesterSubject';

const {Text, Title} = Typography;

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
  const {t} = useLocalization();
  const entityName = t(LOCALE_KEYS.SEMESTER_SUBJECT, {defaultValue: 'Semester Subject'});
  const router = useRouter();
  const [form] = Form.useForm();

  // Hooks
  const {createSemesterSubject, createMultipleSemesterSubjects, editSemesterSubject, actionStatus, loadSemesterSubject} = useSemesterSubjects();
  const {faculties, loadFaculties} = useFaculties();
  const {subjects, loadSubjects, listStatus: subjectsListStatus} = useSubjects();
  const {semesters, loadSemesters} = useSemesters();
  const {batches, loadBatches} = useBatches();

  // State for page mode (multiple faculty assignment)
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | undefined>();
  const [selectedBatchId, setSelectedBatchId] = useState<number | undefined>();
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>();
  const [subjectAssignments, setSubjectAssignments] = useState<Array<{
    subjectId: number;
    faculty: IFacultyAssignment[];
  }>>([]);

  useEffect(() => {
    loadFaculties({page: 1, limit: 100});
    loadSemesters({page: 1, limit: 100});
    loadBatches({page: 1, limit: 100});
    // Don't load subjects upfront - load them dynamically after semester selection
  }, [loadFaculties, loadSemesters, loadBatches]);

  // Debug effect to see when data is loaded
  useEffect(() => {
    console.log('Data loaded:', {
      faculties: faculties.length,
      subjects: subjects.length,
      semesters: semesters.length,
      batches: batches.length
    });
  }, [faculties, subjects, semesters, batches]);

  // Debug effect to monitor subjectAssignments changes
  useEffect(() => {
    console.log('SubjectAssignments changed:', subjectAssignments);
  }, [subjectAssignments]);

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
    }
  }, [mode, form]);

  // Handle semester selection (page mode)
  const handleSemesterChange = async (semesterId: number) => {
    console.log('Semester selected:', semesterId);
    setSelectedSemesterId(semesterId);

    // Reset subject assignments when semester changes
    setSubjectAssignments([]);

    const selectedSemester = semesters.find(s => s.id === semesterId);
    console.log('Selected semester:', selectedSemester);

    if (selectedSemester) {
      setSelectedBatchId(selectedSemester.batchId);
      const selectedBatch = batches.find(b => b.id === selectedSemester.batchId);
      console.log('Selected batch:', selectedBatch);

      if (selectedBatch) {
        setSelectedCourseId(selectedBatch.courseId);
        console.log('Selected course ID:', selectedBatch.courseId);

        // Load subjects for this specific course
        try {
          await loadSubjects({
            page: 1,
            limit: 100,
            courseId: selectedBatch.courseId
          });
          console.log('Subjects loaded for course:', selectedBatch.courseId);
        } catch (error) {
          console.error('Failed to load subjects for course:', error);
        }
      }
    }
  };

  // Get filtered subjects by course
  const getFilteredSubjects = () => {
    if (!selectedCourseId) {
      console.log('No course selected, returning empty array');
      return [];
    }

    if (subjects.length === 0) {
      console.log('No subjects loaded yet');
      return [];
    }

    // Since we're now loading subjects by course ID, all loaded subjects should match
    // But let's still filter to be safe
    const filtered = subjects.filter(subject => {
      const matches = subject.courseId === selectedCourseId;
      console.log(`Subject ${subject.name} (${subject.id}): courseId=${subject.courseId}, selectedCourseId=${selectedCourseId}, matches=${matches}`);
      return matches;
    });

    console.log('Filtered subjects by course:', {
      selectedCourseId,
      totalSubjects: subjects.length,
      filtered: filtered.length,
      subjects: subjects.map(s => ({ id: s.id, name: s.name, courseId: s.courseId }))
    });

    return filtered;
  };

  // Get available subjects (excluding already selected ones)
  const getAvailableSubjects = () => {
    const filteredSubjects = getFilteredSubjects();
    const selectedSubjectIds = subjectAssignments.map(assignment => assignment.subjectId);
    const available = filteredSubjects.filter(subject => !selectedSubjectIds.includes(subject.id));

    // Also include currently selected subjects so they show in their own dropdowns
    const currentSubject = filteredSubjects.find(s => s.id === selectedSubjectIds[0]);
    if (currentSubject && !available.find(s => s.id === currentSubject.id)) {
      available.push(currentSubject);
    }

    console.log('Available subjects:', {
      filteredSubjects: filteredSubjects.length,
      selectedIds: selectedSubjectIds,
      available: available.length,
      availableSubjects: available.map(s => ({ id: s.id, name: s.name, code: s.code }))
    });
    return available;
  };

  // Get subjects for a specific dropdown (including the currently selected one)
  const getSubjectsForDropdown = (currentSubjectId: number) => {
    const filteredSubjects = getFilteredSubjects();
    const selectedSubjectIds = subjectAssignments.map(assignment => assignment.subjectId);

    // Include the current subject plus all unselected ones
    const available = filteredSubjects.filter(subject =>
      subject.id === currentSubjectId || !selectedSubjectIds.includes(subject.id)
    );

    console.log(`Subjects for dropdown (subject ${currentSubjectId}):`, {
      currentSubjectId,
      selectedIds: selectedSubjectIds,
      available: available.length,
      availableSubjects: available.map(s => ({ id: s.id, name: s.name, code: s.code }))
    });

    return available;
  };

  // Check if we can add more subjects
  const canAddSubject = () => {
    if (!selectedSemesterId) return false;
    if (!selectedCourseId) return false;
    if (subjects.length === 0) return false; // Subjects not loaded yet

    // Check if there are any subjects that haven't been assigned yet
    const filteredSubjects = getFilteredSubjects();
    const selectedSubjectIds = subjectAssignments.map(assignment => assignment.subjectId);
    const unassignedSubjects = filteredSubjects.filter(subject => !selectedSubjectIds.includes(subject.id));

    return unassignedSubjects.length > 0;
  };

  // Validate faculty assignments for a subject
  const validateFacultyAssignment = (faculty: IFacultyAssignment) => {
    return faculty.facultyId > 0 && faculty.hoursPerWeek > 0 && faculty.role.trim() !== '';
  };

  // Check if all subjects have valid faculty assignments
  const validateAllAssignments = () => {
    if (subjectAssignments.length === 0) return false;

    return subjectAssignments.every(assignment => {
      // Check if subject has at least one faculty
      if (assignment.faculty.length === 0) return false;

      // Check if at least one faculty has complete data
      return assignment.faculty.some(faculty => validateFacultyAssignment(faculty));
    });
  };

  // Get validation errors for display
  const getValidationErrors = () => {
    const errors: string[] = [];

    subjectAssignments.forEach((assignment, index) => {
      const subjectName = getSubjectName(assignment.subjectId);

      if (assignment.faculty.length === 0) {
        errors.push(`${subjectName}: No faculty assigned`);
      } else {
        const validFacultyCount = assignment.faculty.filter(faculty => validateFacultyAssignment(faculty)).length;
        if (validFacultyCount === 0) {
          errors.push(`${subjectName}: Faculty assignment incomplete (need faculty, hours, and role)`);
        }
      }
    });

    return errors;
  };

  // Add new subject assignment
  const addSubjectAssignment = () => {
    const availableSubjects = getAvailableSubjects();
    console.log('Adding subject assignment, available subjects:', availableSubjects);

    if (availableSubjects.length === 0) {
      message.warning('No more subjects available for this course');
      return;
    }

    const newAssignment = {
      subjectId: availableSubjects[0].id,
      faculty: [{facultyId: 0, hoursPerWeek: 0, role: ''}],
    };

    console.log('New assignment:', newAssignment);
    console.log('Selected subject details:', availableSubjects[0]);

    setSubjectAssignments([
      ...subjectAssignments,
      newAssignment
    ]);
  };

  // Remove subject assignment
  const removeSubjectAssignment = (index: number) => {
    setSubjectAssignments(subjectAssignments.filter((_, i) => i !== index));
  };

  // Add faculty to subject
  const addFacultyToSubject = (subjectIndex: number) => {
    const newAssignments = [...subjectAssignments];
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
    if (newAssignments[subjectIndex].faculty.length === 0) {
      newAssignments[subjectIndex].faculty.push({
        facultyId: 0,
        hoursPerWeek: 0,
        role: '',
      });
    }
    setSubjectAssignments(newAssignments);
  };

  // Update subject assignment
  const updateSubjectAssignment = (index: number, field: 'subjectId' | 'faculty', value: any, facultyIndex?: number) => {
    console.log('updateSubjectAssignment called:', { index, field, value, facultyIndex });

    const newAssignments = [...subjectAssignments];
    if (field === 'subjectId') {
      console.log('Updating subjectId from', newAssignments[index].subjectId, 'to', value);
      newAssignments[index].subjectId = value;
      // Reset faculty assignments for new subject
      newAssignments[index].faculty = [{facultyId: 0, hoursPerWeek: 0, role: ''}];
    } else if (field === 'faculty' && facultyIndex !== undefined) {
      newAssignments[index].faculty[facultyIndex] = {...newAssignments[index].faculty[facultyIndex], ...value};
    }

    console.log('New assignments array:', newAssignments);
    setSubjectAssignments(newAssignments);
  };

  // Get subject name by ID
  const getSubjectName = (subjectId: number) => {
    console.log('getSubjectName called with:', subjectId);
    console.log('Available subjects:', subjects);
    const subject = subjects.find(s => s.id === subjectId);
    console.log('Found subject:', subject);
    const result = subject ? `${subject.name} (${subject.code})` : 'Unknown Subject';
    console.log('Returning:', result);
    return result;
  };

  // Get faculty name by ID
  const getFacultyName = (facultyId: number) => {
    const faculty = faculties.find(f => f.id === facultyId);
    return faculty ? faculty.fullName : 'Unknown Faculty';
  };

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      console.log('Form submission started');

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
            subjects: subjectAssignments.map(assignment => ({
              subjectId: assignment.subjectId,
              faculty: assignment.faculty.filter(f => f.facultyId > 0), // Only include valid faculty assignments
            })),
          };
          console.log('Submitting payload:', payload);
          await createMultipleSemesterSubjects(payload);
        }
      }

      toast.success(`${mode === 'create' ? 'Created' : 'Updated'} successfully`);
      console.log('Success toast shown, checking redirect conditions');

      if (onSuccess) {
        console.log('Calling onSuccess callback');
        onSuccess();
      } else if (!embedded) {
        console.log('Redirecting to /semester-subjects');
        // Add a small delay to ensure the success message is visible
        setTimeout(() => {
          try {
            // Try router.push first
            router.push('/semester-subjects');
            console.log('Router push completed');
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
        label={t(LOCALE_KEYS.SEMESTER, {defaultValue: 'Semester'})}
        name="semesterId"
        rules={[{required: true, message: 'Please select a semester'}]}
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
        label={t(LOCALE_KEYS.SUBJECT, {defaultValue: 'Subject'})}
        name="subjectId"
        rules={[{required: true, message: 'Please select a subject'}]}
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
          {onCancel && (
            <Button onClick={onCancel}>Cancel</Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );

  // Form content for page mode (multiple assignments)
  const pageFormContent = (
    <div style={{padding: '24px', height: 'calc(100vh - 128px)', overflow: 'auto'}}>
      <Row gutter={24}>
        <Col span={12}>
          <Card title={`${mode === 'create' ? 'Create' : 'Edit'} ${entityName}`} style={{height: 'fit-content'}}>
            {/* Semester Selection */}
            <Form.Item
              label={t(LOCALE_KEYS.SEMESTER, {defaultValue: 'Semester'})}
              required
            >
              <Select
                placeholder="Select semester"
                value={selectedSemesterId}
                onChange={handleSemesterChange}
                style={{width: '100%'}}
              >
                {semesters.map((semester) => (
                  <Select.Option key={semester.id} value={semester.id}>
                    {semester.name} - {semester.batch?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Course and Batch Info */}
            {selectedSemesterId && selectedBatchId && selectedCourseId && (
              <div style={{marginBottom: 16}}>
                <Text strong>Course: </Text>
                <Text>{batches.find(b => b.id === selectedBatchId)?.course?.name}</Text>
                <br />
                <Text strong>Batch: </Text>
                <Text>{batches.find(b => b.id === selectedBatchId)?.name}</Text>
              </div>
            )}

            {/* Debug Info */}
            <div style={{marginBottom: 16, padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4}}>
              <Text type="secondary" style={{fontSize: '12px'}}>
                Debug: Semester={selectedSemesterId}, Batch={selectedBatchId}, Course={selectedCourseId}
                <br />
                Subjects loaded: {subjects.length}, Available: {getAvailableSubjects().length}
                <br />
                Can add: {canAddSubject() ? 'Yes' : 'No'}
                <br />
                Subject Assignments: {subjectAssignments.length}
                {subjectAssignments.length > 0 && (
                  <>
                    <br />
                    Assignment Details: {subjectAssignments.map((a, i) =>
                      `[${i}: ID=${a.subjectId} (${typeof a.subjectId}), Name=${getSubjectName(a.subjectId)}]`
                    ).join(', ')}
                  </>
                )}
                {subjects.length > 0 && (
                  <>
                    <br />
                    Raw Subjects: {subjects.slice(0, 3).map(s =>
                      `ID:${s.id} (${typeof s.id}), Name:${s.name}, Course:${s.courseId}`
                    ).join(' | ')}
                    {subjects.length > 3 && `... and ${subjects.length - 3} more`}
                  </>
                )}
              </Text>
            </div>

            {/* Add Subject Button */}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addSubjectAssignment}
              disabled={!canAddSubject()}
              loading={subjectsListStatus.status === Status.LOADING}
              style={{width: '100%', marginBottom: 16}}
            >
              {subjectsListStatus.status === Status.LOADING
                ? 'Loading Subjects...'
                : `Add Subject (${(() => {
                    const filteredSubjects = getFilteredSubjects();
                    const selectedSubjectIds = subjectAssignments.map(assignment => assignment.subjectId);
                    const unassignedSubjects = filteredSubjects.filter(subject => !selectedSubjectIds.includes(subject.id));
                    return unassignedSubjects.length;
                  })()} available)`
              }
            </Button>

            {/* No Subjects Message */}
            {selectedCourseId && subjects.length === 0 && subjectsListStatus.status === Status.SUCCESS && (
              <div style={{marginBottom: 16, padding: 8, backgroundColor: '#fff2e8', borderRadius: 4, border: '1px solid #ffd591'}}>
                <Text type="warning">
                  No subjects found for this course. Please check if subjects are assigned to the course.
                </Text>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="primary"
              htmlType="submit"
              loading={actionStatus.status === Status.LOADING}
              disabled={!validateAllAssignments()}
              style={{width: '100%'}}
              onClick={() => handleSubmit({})}
            >
              Create Semester Subjects
            </Button>

            {/* Validation Errors */}
            {subjectAssignments.length > 0 && !validateAllAssignments() && (
              <div style={{marginTop: 16, padding: 12, backgroundColor: '#fff2f0', borderRadius: 4, border: '1px solid #ffccc7'}}>
                <Text type="danger" strong>Validation Errors:</Text>
                {getValidationErrors().map((error, index) => (
                  <div key={index} style={{marginTop: 4}}>
                    <Text type="danger">• {error}</Text>
                  </div>
                ))}
              </div>
            )}

            {/* Summary - Moved from right column */}
            {subjectAssignments.length > 0 && (
              <Card title="Summary" style={{marginTop: 16}}>
                <Text strong>Total Subjects: </Text>
                <Text>{subjectAssignments.length}</Text>
                <br />
                <Text strong>Total Faculty Assignments: </Text>
                <Text>{subjectAssignments.reduce((total, assignment) => total + assignment.faculty.length, 0)}</Text>
              </Card>
            )}
          </Card>
        </Col>

        <Col span={12}>
          {/* Subject Assignments */}
          {subjectAssignments.map((assignment, subjectIndex) => (
            <Card
              key={subjectIndex}
              title={assignment.subjectId ? getSubjectName(assignment.subjectId) : `Subject ${subjectIndex + 1}`}
              style={{marginBottom: 16}}
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
              <Form.Item
                label={t(LOCALE_KEYS.SUBJECT, {defaultValue: 'Subject'})}
                required
              >
                <Select
                  key={`subject-${subjectIndex}-${assignment.subjectId}`}
                  value={assignment.subjectId ? String(assignment.subjectId) : undefined}
                  onChange={(value) => {
                    console.log('Subject changed to:', value, 'Type:', typeof value);
                    // Convert string back to number for storage
                    const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
                    updateSubjectAssignment(subjectIndex, 'subjectId', numericValue);
                  }}
                  placeholder="Select subject"
                  style={{width: '100%'}}
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
              <div style={{marginBottom: 16}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
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
                {assignment.faculty.length > 0 && (
                  <div style={{marginBottom: 8, padding: 4, backgroundColor: assignment.faculty.some(f => validateFacultyAssignment(f)) ? '#f6ffed' : '#fff2f0', borderRadius: 4, border: `1px solid ${assignment.faculty.some(f => validateFacultyAssignment(f)) ? '#b7eb8f' : '#ffccc7'}`}}>
                    <Text type={assignment.faculty.some(f => validateFacultyAssignment(f)) ? 'success' : 'danger'} style={{fontSize: '12px'}}>
                      {assignment.faculty.some(f => validateFacultyAssignment(f))
                        ? '✓ Faculty assignment complete'
                        : '⚠ Faculty assignment incomplete - need faculty, hours, and role'
                      }
                    </Text>
                  </div>
                )}

                {assignment.faculty.map((faculty, facultyIndex) => (
                  <Row key={facultyIndex} gutter={16} style={{marginBottom: 16}}>
                    <Col span={8}>
                      <Form.Item
                        label="Faculty"
                        required
                        validateStatus={faculty.facultyId > 0 ? 'success' : 'error'}
                        help={faculty.facultyId > 0 ? '' : 'Select faculty'}
                        style={{marginBottom: 0}}
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                      >
                        <Select
                          value={faculty.facultyId ? String(faculty.facultyId) : undefined}
                          onChange={(value) => {
                            const numericValue = typeof value === 'string' ? parseInt(value, 10) : value;
                            updateSubjectAssignment(subjectIndex, 'faculty', {facultyId: numericValue}, facultyIndex);
                          }}
                          placeholder="Select faculty"
                          style={{width: '100%'}}
                          showSearch
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
                        required
                        validateStatus={faculty.hoursPerWeek > 0 ? 'success' : 'error'}
                        help={faculty.hoursPerWeek > 0 ? '' : 'Enter hours'}
                        style={{marginBottom: 0}}
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                      >
                        <InputNumber
                          value={faculty.hoursPerWeek || undefined}
                          onChange={(value) => updateSubjectAssignment(subjectIndex, 'faculty', {hoursPerWeek: value}, facultyIndex)}
                          placeholder="Hours/week"
                          min={1}
                          max={40}
                          style={{width: '100%'}}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="Role"
                        required
                        validateStatus={faculty.role.trim() !== '' ? 'success' : 'error'}
                        help={faculty.role.trim() !== '' ? '' : 'Select role'}
                        style={{marginBottom: 0}}
                        labelCol={{span: 24}}
                        wrapperCol={{span: 24}}
                      >
                        <Select
                          value={faculty.role || undefined}
                          onChange={(value) => updateSubjectAssignment(subjectIndex, 'faculty', {role: value}, facultyIndex)}
                          placeholder="Select role"
                          style={{width: '100%'}}
                        >
                          <Select.Option value="Primary Instructor">Primary Instructor</Select.Option>
                          <Select.Option value="Lab Instructor">Lab Instructor</Select.Option>
                          <Select.Option value="Tutorial Assistant">Tutorial Assistant</Select.Option>
                          <Select.Option value="Co-Instructor">Co-Instructor</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <div style={{paddingTop: 32}}>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeFacultyFromSubject(subjectIndex, facultyIndex)}
                          disabled={assignment.faculty.length === 1}
                        />
                      </div>
                    </Col>
                  </Row>
                ))}
              </div>
            </Card>
          ))}
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
