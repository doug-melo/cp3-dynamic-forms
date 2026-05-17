import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormValues } from '../types/form';

const STORAGE_KEY = '@cp3_dynamic_form';

export const saveFormValues = async (values: FormValues): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(values));
};

export const loadFormValues = async (): Promise<FormValues | null> => {
  const storedValues = await AsyncStorage.getItem(STORAGE_KEY);

  if (storedValues === null) {
    return null;
  }

  return JSON.parse(storedValues) as FormValues;
};

export const clearFormValues = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};
