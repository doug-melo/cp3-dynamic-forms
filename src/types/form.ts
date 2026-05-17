export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'multiline'
  | 'textarea'
  | 'select'
  | 'combo'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'date';

export type FormValue = string | boolean | string[];

export type FormValues = Record<string, FormValue>;

export type ValidationErrors = Record<string, string>;

export interface FieldOption {
  label: string;
  value: string;
}

export interface FieldConfig {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: FieldOption[];
}

export interface FormConfig {
  title: string;
  fields: FieldConfig[];
}
