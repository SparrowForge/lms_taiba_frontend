export enum QuestionType {
  MCQ = 'mcq',
  WRITTEN = 'written',
  MIXED = 'mixed',
}

export const QUESTION_TYPE_OPTIONS = [
  { key: 'question_type_mcq', value: QuestionType.MCQ, labelKey: 'question_type_mcq' },
  { key: 'question_type_written', value: QuestionType.WRITTEN, labelKey: 'question_type_written' },
  { key: 'question_type_mixed', value: QuestionType.MIXED, labelKey: 'question_type_mixed' },
];
