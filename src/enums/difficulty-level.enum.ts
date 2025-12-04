import { IStatusOption } from '@/types/statusSelect';

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

// Difficulty Level Options
export const DIFFICULTY_LEVEL_OPTIONS: IStatusOption[] = Object.values(DifficultyLevel).map(
  (level) => ({
    key: `difficulty_level_${level}`,
    value: level,
    labelKey: `difficulty_level_${level}`,
  }),
);
