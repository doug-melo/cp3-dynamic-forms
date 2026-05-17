import { FieldConfig, FormValue, FormValues, ValidationErrors } from '../types/form';

export const createInitialValues = (fields: FieldConfig[]): FormValues =>
  fields.reduce<FormValues>((values, field) => {
    if (field.type === 'checkbox' || field.type === 'switch') {
      return { ...values, [field.id]: false };
    }

    return { ...values, [field.id]: '' };
  }, {});

const isEmptyValue = (value: FormValue): boolean => {
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'boolean') {
    return value === false;
  }

  return value.trim().length === 0;
};

const isValidEmail = (value: string): boolean => /^\S+@\S+\.\S+$/.test(value);

const isValidDate = (value: string): boolean => {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);

  if (match === null) {
    return false;
  }

  const [, dayText, monthText, yearText] = match;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  const parsedDate = new Date(year, month - 1, day);

  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
  );
};

export const validateForm = (fields: FieldConfig[], values: FormValues): ValidationErrors =>
  fields.reduce<ValidationErrors>((errors, field) => {
    const value = values[field.id];

    if (field.required && (value === undefined || isEmptyValue(value))) {
      return { ...errors, [field.id]: `${field.label} e obrigatorio.` };
    }

    if (typeof value === 'string' && value.trim().length > 0) {
      if (field.type === 'email' && !isValidEmail(value)) {
        return { ...errors, [field.id]: 'Informe um e-mail valido.' };
      }

      if (field.type === 'number' && Number.isNaN(Number(value))) {
        return { ...errors, [field.id]: 'Informe um numero valido.' };
      }

      if (field.type === 'date' && !isValidDate(value)) {
        return { ...errors, [field.id]: 'Use o formato dd-mm-yyyy.' };
      }
    }

    return errors;
  }, {});

export const getOptionLabel = (field: FieldConfig, value: FormValue): string => {
  if (typeof value !== 'string') {
    return '';
  }

  const option = field.options?.find((item) => item.value === value);
  return option?.label ?? value;
};

export const formatValue = (field: FieldConfig, value: FormValue): string => {
  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Nao';
  }

  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return getOptionLabel(field, value);
};
