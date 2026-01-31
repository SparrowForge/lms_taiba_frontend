'use client';

import { Button, Card, Form, message } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { LOCALE_KEYS } from '@/constants/localizationKeys';
import { Status, StudentStatus } from '@/enums';

import RegistrationSteps from '@/components/registration/RegistrationSteps';
import StudentEducationStep from '@/components/registration/StudentEducationStep';
import StudentInformationStep from '@/components/registration/StudentInformationStep';
import StudentProfileStep from '@/components/registration/StudentProfileStep';

import { useBatches } from '@/hooks/useBatches';
import { useLocalization } from '@/hooks/useLocalization';
import { useStudents } from '@/hooks/useStudents';

import { IAddressCreate } from '@/types/address';
import { IBatch } from '@/types/batch';
import { IStudentCreate, IStudentRegistrationCreate } from '@/types/student';
import { IStudentEducationCreate } from '@/types/studentEducation';
import { IStudentProfileCreate } from '@/types/studentProfile';
import { useSections } from '@/hooks/useSections';

const RegisterStudentPage: React.FC = () => {
  const { t } = useLocalization();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  const { loadBatchByCodePublic, selectedBatch } = useBatches();
  const { registerStudent, actionStatus } = useStudents();

  const searchParams = useSearchParams();

     const {loadSections, sections} = useSections()
  


  useEffect(() => {
    const batchCode = searchParams.get('batchCode');
    console.log('batchCode from query params:', batchCode);
    if (batchCode) {
      loadBatchByCodePublic(batchCode).catch(() => void 0);
    }
  }, [searchParams, loadBatchByCodePublic]);

         useEffect(() => {
         if (selectedBatch?.id) {
           loadSections({ page: 1, limit: 100, batchId: selectedBatch?.id });
         }
       }, [selectedBatch, loadSections]);

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const handleNext = async () => {
    try {
      // Validate current step fields
      const stepFields = getStepFields(currentStep);
      console.log(form.getFieldsValue(), 'form.getFieldsValue()');
      await form.validateFields(stepFields);

      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      message.error(
        t(LOCALE_KEYS.PLEASE_FILL_REQUIRED_FIELDS, {
          defaultValue: 'Please fill all required fields',
        }),
      );
    }
  };

  const getStepFields = (step: number): string[] => {
    switch (step) {
      case 0: // Student Information
        return ['firstName', 'lastName', 'email', 'phone'];
      case 1: // Student Profile
        return [
          'dob',
          'placeOfBirth',
          'gender',
          'maritalStatus',
          'presentAddressName',
          'presentAddress',
          'presentZipCode',
          'presentCountry',
          'presentAddressPhone',
          'permanentAddressName',
          'permanentAddress',
          'permanentZipCode',
          'permanentCountry',
          'permanentAddressPhone',
          'permanentAddressEmail',
          'countryCode',
          'identityType',
          'identityNo',
          'isTransferred',
          'isInternational',
        ];
      case 2: // Student Education
        return ['educations'];
      default:
        return [];
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate all form fields
      await form.validateFields();

      // Get all form values
      const formValues = form.getFieldsValue();

      // Structure data according to create types
      const submissionData: IStudentRegistrationCreate = {
        student: buildStudentData(formValues, selectedBatch as IBatch),
        profile: buildStudentProfileData(formValues),
        presentAddress: buildPresentAddressData(formValues),
        permanentAddress: buildPermanentAddressData(formValues),
        educations: buildEducationData(formValues),
      };

      console.log('Final submission with structured data:', submissionData);

      // Send data to backend API using hook
      const registeredStudent = await registerStudent(submissionData);

      message.success(
        t(LOCALE_KEYS.REGISTRATION_SUBMITTED_SUCCESSFULLY, {
          defaultValue: 'Registration submitted successfully!',
        }),
      );

      // Redirect to success page
      router.push('/student-register/success');
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Registration failed. Please try again.';
      message.error(errorMessage);
    }
  };

  const buildStudentData = (formValues: any, selectedBatch: IBatch): IStudentCreate => {
    const { firstName, middleName, lastName } = formValues;

    console.log(firstName, middleName, lastName, 'firstName, middleName, lastName');
    return {
      applicationNo: undefined, // Generate application number
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      cardNo: undefined, // Generate card number
      registrationNo: undefined, // Generate registration number
      admissionDate: new Date().toISOString().split('T')[0], // Current date
      courseId: selectedBatch.courseId,
      batchId: selectedBatch.id,
      branchId: selectedBatch.course.department.branchId,
      referenceNo: undefined, // Generate reference number
      fileIds: [], // Empty array for now
      admissionSource: 'online_registration', // Default value
      status: StudentStatus.PENDING, // Default status
    } as IStudentCreate;
  };

  const buildStudentProfileData = (formValues: any): IStudentProfileCreate => {
    const {
      dob,
      placeOfBirth,
      gender,
      maritalStatus,
      identityType,
      identityNo,
      isTransferred,
      isInternational,
      transferInfo,
      phone,
      mobile,
      email,
      countryCode,
      whatsappNumber,
    } = formValues;

    return {
      studentId: 0, // Will be set after student is created
      dob: dob,
      placeOfBirth: placeOfBirth,
      gender: gender,
      maritalStatus: maritalStatus,
      presentAddressId: 0, // Will be set after address is created
      permanentAddressId: 0, // Will be set after address is created
      phone: phone || '',
      mobile: mobile || '',
      whatsappNumber: whatsappNumber || '',
      email: email || '',
      isTransferred: isTransferred || false,
      transferInfo: transferInfo || null,
      isInternational: isInternational || false,
      countryCode: countryCode || '',
      identityType: identityType,
      identityNo: identityNo,
    };
  };

  const buildPresentAddressData = (formValues: any): IAddressCreate => {
    const {
      presentAddressName,
      presentAddress,
      presentCity,
      presentState,
      presentZipCode,
      presentCountry,
      presentAddressPhone,
      presentAddressEmail,
    } = formValues;

    return {
      name: presentAddressName || '',
      address: presentAddress || '',
      city: presentCity || '',
      state: presentState || '',
      zipCode: presentZipCode || '',
      country: presentCountry || '',
      phone: presentAddressPhone || '',
      email: presentAddressEmail || '',
    };
  };

  const buildPermanentAddressData = (formValues: any): IAddressCreate => {
    const {
      permanentAddressName,
      permanentAddress,
      permanentCity,
      permanentState,
      permanentZipCode,
      permanentCountry,
      permanentAddressPhone,
      permanentAddressEmail,
    } = formValues;

    return {
      name: permanentAddressName || '',
      address: permanentAddress || '',
      city: permanentCity || '',
      state: permanentState || '',
      zipCode: permanentZipCode || '',
      country: permanentCountry || '',
      phone: permanentAddressPhone || '',
      email: permanentAddressEmail || '',
    };
  };

  const buildEducationData = (formValues: any): IStudentEducationCreate[] => {
    const { educations = [] } = formValues;

    return educations.map((education: any) => ({
      studentId: 0, // Will be set after student is created
      degreeType: education.degreeType,
      foundationCourse: education.foundationCourse || null,
      degreeName: education.degreeName,
      passingYear: education.passingYear,
      institute: education.institute,
      result: education.result,
      groupMajor: education.groupMajor,
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <StudentInformationStep sections={sections} form={form} />;
      case 1:
        return <StudentProfileStep form={form} />;
      case 2:
        return <StudentEducationStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto px-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t(LOCALE_KEYS.STUDENT_REGISTRATION)}</h1>
          <p className="">{t(LOCALE_KEYS.REGISTRATION_SUBTITLE)}</p>
        </div>

        {/* Batch Details */}
        <Card style={{ marginBottom: '16px' }}>
          <p className="text-gray-600 mb-6">
            {t(LOCALE_KEYS.INSTITUTE)}: {selectedBatch?.course?.department?.branch?.institute?.name}
            , {selectedBatch?.course?.department?.branch?.institute?.code},{' '}
            {selectedBatch?.course?.department?.branch?.institute.address.address},{' '}
            {selectedBatch?.course?.department?.branch?.institute.address.city},{' '}
            {selectedBatch?.course?.department?.branch?.institute.address.state},{' '}
            {selectedBatch?.course?.department?.branch?.institute.address.zipCode},{' '}
            {selectedBatch?.course?.department?.branch?.institute.address.country}
          </p>
          <p className="text-gray-600 mb-6">
            {t(LOCALE_KEYS.BRANCH)}: {selectedBatch?.course?.department?.branch?.name},{' '}
            {selectedBatch?.course?.department?.branch?.code}
          </p>
          <p className="text-gray-600 mb-6">
            {t(LOCALE_KEYS.BATCH)}: {selectedBatch?.name}, {selectedBatch?.code},{' '}
            {selectedBatch?.academicYear} - {selectedBatch?.session}, {selectedBatch?.startDate} -{' '}
            {selectedBatch?.endDate},
          </p>
          <p className="text-gray-600 mb-6">
            {t(LOCALE_KEYS.COURSE)}: {selectedBatch?.course?.name}, {selectedBatch?.course?.code} (
            {selectedBatch?.course?.durationInSemesters} semesters),{' '}
            {selectedBatch?.course?.description}
          </p>
          <p className="text-gray-600 mb-6">
            {t(LOCALE_KEYS.DEPARTMENT)}: {selectedBatch?.course?.department?.name},{' '}
            {selectedBatch?.course?.department?.code}
          </p>
        </Card>

        {/* Steps */}
        <Card className="">
          <RegistrationSteps currentStep={currentStep} onStepClick={handleStepClick} />

          {/* Step Content + Single Form Wrapper */}
          <Card className="" style={{ marginTop: '16px' }}>
            <Form form={form} layout="vertical" className="w-full">
              <div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
                <StudentInformationStep  form={form} />
              </div>
              <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                <StudentProfileStep form={form} />
              </div>
              <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
                <StudentEducationStep form={form} />
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <div>
                  {currentStep > 0 && (
                    <Button size="large" onClick={handlePrevious}>
                      {t(LOCALE_KEYS.PREVIOUS)}
                    </Button>
                  )}
                </div>

                <div className="flex space-x-3 gap-3">
                  <Button size="large" onClick={() => router.push('/')}>
                    {t(LOCALE_KEYS.CANCEL)}
                  </Button>

                  {currentStep < 2 ? (
                    <Button type="primary" size="large" onClick={handleNext}>
                      {t(LOCALE_KEYS.NEXT)}
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      size="large"
                      onClick={handleSubmit}
                      loading={actionStatus.status === Status.LOADING}
                    >
                      {t(LOCALE_KEYS.SUBMIT_REGISTRATION)}
                    </Button>
                  )}
                </div>
              </div>
            </Form>
          </Card>
        </Card>
      </div>
    </div>
  );
};

export default RegisterStudentPage;
