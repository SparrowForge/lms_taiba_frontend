/**
 * Status Select interfaces and types
 */

export interface IStatusOption {
  key: string; // Unique identifier for the option
  value: string; // Enum value (e.g., 'active', 'pending', 'graduated')
  labelKey: string; // Localization key (e.g., 'STATUS_ACTIVE', 'STATUS_PENDING')
}

export interface IStatusSelectProps {
  value?: string | null;
  onChange?: (value: string) => void;
  allowClear?: boolean;
  disabled?: boolean;
  placeholder?: string;
  size?: 'small' | 'middle' | 'large';
  style?: React.CSSProperties;
  options: IStatusOption[];
  initialValue?: string;
}
