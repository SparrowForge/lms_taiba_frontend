'use client';

import {Steps} from 'antd';
import React from 'react';

import {LOCALE_KEYS} from '@/constants/localizationKeys';

import {useLocalization} from '@/hooks/useLocalization';

const { Step } = Steps;

interface RegistrationStepsProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const RegistrationSteps: React.FC<RegistrationStepsProps> = ({ currentStep, onStepClick }) => {
  const { t } = useLocalization();

  const steps = [
    {
      title: t(LOCALE_KEYS.STUDENT_INFORMATION),
      description: t(LOCALE_KEYS.BASIC_STUDENT_DETAILS),
    },
    {
      title: t(LOCALE_KEYS.STUDENT_PROFILE),
      description: t(LOCALE_KEYS.PERSONAL_INFORMATION),
    },
    {
      title: t(LOCALE_KEYS.STUDENT_EDUCATION),
      description: t(LOCALE_KEYS.ACADEMIC_BACKGROUND),
    },
  ];

  return (
    <Steps current={currentStep} onChange={onStepClick}>
      {steps.map((step, index) => (
        <Step key={index} title={step.title} description={step.description} />
      ))}
    </Steps>
  );
};

export default RegistrationSteps;
