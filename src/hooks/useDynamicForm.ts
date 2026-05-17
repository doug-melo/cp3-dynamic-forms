import { useCallback, useEffect, useMemo, useState } from 'react';
import { clearFormValues, loadFormValues, saveFormValues } from '../services/storageService';
import { FormConfig, FormValue, FormValues, ValidationErrors } from '../types/form';
import { createInitialValues, validateForm } from '../utils/formUtils';

interface UseDynamicFormResult {
  errors: ValidationErrors;
  hasStoredData: boolean;
  isLoading: boolean;
  submittedValues: FormValues | null;
  updateValue: (fieldId: string, value: FormValue) => void;
  values: FormValues;
  clearData: () => Promise<void>;
  submit: () => Promise<void>;
}

export const useDynamicForm = (config: FormConfig): UseDynamicFormResult => {
  const initialValues = useMemo(() => createInitialValues(config.fields), [config.fields]);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasStoredData, setHasStoredData] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const restoreValues = async (): Promise<void> => {
      const storedValues = await loadFormValues();

      if (!isMounted) {
        return;
      }

      if (storedValues !== null) {
        setValues({ ...initialValues, ...storedValues });
        setSubmittedValues({ ...initialValues, ...storedValues });
        setHasStoredData(true);
      }

      setIsLoading(false);
    };

    restoreValues();

    return () => {
      isMounted = false;
    };
  }, [initialValues]);

  const updateValue = useCallback((fieldId: string, value: FormValue): void => {
    setValues((currentValues) => ({ ...currentValues, [fieldId]: value }));
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[fieldId];
      return nextErrors;
    });
  }, []);

  const submit = useCallback(async (): Promise<void> => {
    const validationErrors = validateForm(config.fields, values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    await saveFormValues(values);
    setSubmittedValues(values);
    setHasStoredData(true);
  }, [config.fields, values]);

  const clearData = useCallback(async (): Promise<void> => {
    await clearFormValues();
    setValues(initialValues);
    setSubmittedValues(null);
    setErrors({});
    setHasStoredData(false);
  }, [initialValues]);

  return {
    errors,
    hasStoredData,
    isLoading,
    submittedValues,
    updateValue,
    values,
    clearData,
    submit,
  };
};
