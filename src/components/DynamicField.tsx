import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { ChangeEvent, CSSProperties, ReactElement, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { FieldConfig, FieldOption, FormValue } from '../types/form';

interface DynamicFieldProps {
  error?: string;
  field: FieldConfig;
  value: FormValue;
  onChange: (fieldId: string, value: FormValue) => void;
}

const toWebDateValue = (value: FormValue): string => {
  if (typeof value !== 'string') {
    return '';
  }

  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);
  return match === null ? '' : `${match[3]}-${match[2]}-${match[1]}`;
};

const toDisplayDateValue = (value: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match === null ? '' : `${match[3]}-${match[2]}-${match[1]}`;
};

const toDatePickerValue = (value: FormValue): Date => {
  const webValue = toWebDateValue(value);

  if (webValue.length === 0) {
    return new Date();
  }

  const [year, month, day] = webValue.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export function DynamicField({ error, field, value, onChange }: DynamicFieldProps) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const selectedLabel = useMemo(() => {
    if (typeof value !== 'string') {
      return 'Selecione';
    }

    return field.options?.find((option) => option.value === value)?.label ?? 'Selecione';
  }, [field.options, value]);

  const handleTextChange = (nextValue: string): void => {
    onChange(field.id, nextValue);
  };

  const handleWebDateChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(field.id, toDisplayDateValue(event.target.value));
  };

  const handleNativeDateChange = (event: DateTimePickerEvent, selectedDate?: Date): void => {
    if (Platform.OS === 'android') {
      setIsDatePickerOpen(false);
    }

    if (event.type === 'dismissed' || selectedDate === undefined) {
      return;
    }

    const day = String(selectedDate.getDate()).padStart(2, '0');
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const year = selectedDate.getFullYear();
    onChange(field.id, `${day}-${month}-${year}`);
  };

  const handleOptionPress = (option: FieldOption): void => {
    onChange(field.id, option.value);
    setIsSelectOpen(false);
  };

  const inputProps = useMemo<TextInputProps>(() => {
    const baseProps: TextInputProps = {
      autoCapitalize: field.type === 'email' ? 'none' : 'sentences',
      keyboardType:
        field.type === 'email'
          ? 'email-address'
          : field.type === 'number'
            ? 'numeric'
            : field.type === 'date'
              ? 'numbers-and-punctuation'
              : 'default',
      placeholder: field.placeholder,
      secureTextEntry: field.type === 'password',
    };

    if (field.type === 'multiline' || field.type === 'textarea') {
      return {
        ...baseProps,
        multiline: true,
        numberOfLines: 4,
        textAlignVertical: 'top',
      };
    }

    return baseProps;
  }, [field.placeholder, field.type]);

  const renderTextInput = (): ReactElement => (
    <TextInput
      {...inputProps}
      accessibilityLabel={field.label}
      onChangeText={handleTextChange}
      style={[styles.input, inputProps.multiline === true && styles.textArea, error && styles.inputError]}
      value={typeof value === 'string' ? value : ''}
    />
  );

  const renderDateInput = (): ReactElement => {
    if (Platform.OS === 'web') {
      const webStyle: CSSProperties = {
        backgroundColor: '#FFFFFF',
        borderColor: error ? '#D92D20' : '#CBD5E1',
        borderRadius: 8,
        borderStyle: 'solid',
        borderWidth: 1,
        boxSizing: 'border-box',
        color: '#111827',
        fontSize: 16,
        minHeight: 48,
        outlineColor: '#0F766E',
        padding: '12px 14px',
        width: '100%',
      };

      return (
        <>
          {React.createElement('input', {
            'aria-label': field.label,
            onChange: handleWebDateChange,
            style: webStyle,
            type: 'date',
            value: toWebDateValue(value),
          })}
        </>
      );
    }

    const displayValue = typeof value === 'string' && value.length > 0 ? value : field.placeholder;

    return (
      <View>
        <Pressable
          accessibilityRole="button"
          onPress={() => setIsDatePickerOpen(true)}
          style={[styles.input, styles.dateInput, error && styles.inputError]}
        >
          <Text style={[styles.selectText, displayValue === field.placeholder && styles.placeholderText]}>
            {displayValue}
          </Text>
        </Pressable>
        {isDatePickerOpen && (
          <DateTimePicker
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            mode="date"
            onChange={handleNativeDateChange}
            value={toDatePickerValue(value)}
          />
        )}
      </View>
    );
  };

  const renderOptions = (variant: 'radio' | 'select'): ReactElement => (
    <View style={variant === 'radio' ? styles.choiceGroup : styles.dropdownList}>
      {field.options?.map((option) => {
        const isSelected = value === option.value;

        return (
          <Pressable
            accessibilityRole={variant === 'radio' ? 'radio' : 'button'}
            key={option.value}
            onPress={() => handleOptionPress(option)}
            style={[styles.choiceButton, isSelected && styles.choiceButtonActive]}
          >
            <View style={[styles.choiceMark, isSelected && styles.choiceMarkActive]} />
            <Text style={[styles.choiceText, isSelected && styles.choiceTextActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );

  const renderSelect = (): ReactElement => (
    <View>
      <Pressable
        accessibilityRole="button"
        onPress={() => setIsSelectOpen((currentValue) => !currentValue)}
        style={[styles.input, styles.selectInput, error && styles.inputError]}
      >
        <Text style={[styles.selectText, selectedLabel === 'Selecione' && styles.placeholderText]}>
          {selectedLabel}
        </Text>
        <Text style={styles.chevron}>{isSelectOpen ? '^' : 'v'}</Text>
      </Pressable>
      {isSelectOpen && renderOptions('select')}
    </View>
  );

  const renderBooleanInput = (variant: 'checkbox' | 'switch'): ReactElement => {
    const isEnabled = typeof value === 'boolean' ? value : false;

    if (variant === 'switch') {
      return (
        <View style={styles.switchRow}>
          <Text style={styles.booleanLabel}>{isEnabled ? 'Ativado' : 'Desativado'}</Text>
          <Switch value={isEnabled} onValueChange={(nextValue) => onChange(field.id, nextValue)} />
        </View>
      );
    }

    return (
      <Pressable
        accessibilityRole="checkbox"
        onPress={() => onChange(field.id, !isEnabled)}
        style={[styles.checkboxRow, isEnabled && styles.checkboxRowActive, error && styles.inputError]}
      >
        <View style={[styles.checkboxBox, isEnabled && styles.checkboxBoxActive]}>
          {isEnabled && <Text style={styles.checkboxCheck}>✓</Text>}
        </View>
        <Text style={styles.checkboxText}>{field.label}</Text>
      </Pressable>
    );
  };

  const renderInput = (): ReactElement => {
    switch (field.type) {
      case 'radio':
        return renderOptions('radio');
      case 'select':
      case 'combo':
        return renderSelect();
      case 'checkbox':
        return renderBooleanInput('checkbox');
      case 'switch':
        return renderBooleanInput('switch');
      case 'date':
        return renderDateInput();
      default:
        return renderTextInput();
    }
  };

  return (
    <View style={styles.field}>
      {field.type !== 'checkbox' && (
        <Text style={styles.label}>
          {field.label}
          {field.required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      {renderInput()}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    color: '#1F2937',
    fontSize: 15,
    fontWeight: '700',
  },
  required: {
    color: '#D92D20',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    color: '#111827',
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#D92D20',
  },
  textArea: {
    minHeight: 104,
  },
  selectInput: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    justifyContent: 'center',
  },
  selectText: {
    color: '#111827',
    fontSize: 16,
  },
  placeholderText: {
    color: '#6B7280',
  },
  chevron: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '800',
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    overflow: 'hidden',
  },
  choiceGroup: {
    gap: 8,
  },
  choiceButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 46,
    paddingHorizontal: 12,
  },
  choiceButtonActive: {
    backgroundColor: '#EAF6F2',
    borderColor: '#0F766E',
  },
  choiceMark: {
    borderColor: '#94A3B8',
    borderRadius: 8,
    borderWidth: 2,
    height: 16,
    width: 16,
  },
  choiceMarkActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  choiceText: {
    color: '#334155',
    fontSize: 15,
  },
  choiceTextActive: {
    color: '#0F766E',
    fontWeight: '700',
  },
  switchRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: 14,
  },
  booleanLabel: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
  },
  checkboxRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  checkboxRowActive: {
    backgroundColor: '#EAF6F2',
    borderColor: '#0F766E',
  },
  checkboxBox: {
    alignItems: 'center',
    borderColor: '#94A3B8',
    borderRadius: 6,
    borderWidth: 2,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  checkboxBoxActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  checkboxCheck: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 18,
  },
  checkboxText: {
    color: '#1F2937',
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
  },
  error: {
    color: '#D92D20',
    fontSize: 13,
    fontWeight: '600',
  },
});
