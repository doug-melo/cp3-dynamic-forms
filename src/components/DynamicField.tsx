import { ReactElement, useMemo, useState } from 'react';
import {
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

export function DynamicField({ error, field, value, onChange }: DynamicFieldProps) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectedLabel = useMemo(() => {
    if (typeof value !== 'string') {
      return 'Selecione';
    }

    return field.options?.find((option) => option.value === value)?.label ?? 'Selecione';
  }, [field.options, value]);

  const handleTextChange = (nextValue: string): void => {
    onChange(field.id, nextValue);
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
          {isEnabled && <Text style={styles.checkboxCheck}>OK</Text>}
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
    fontSize: 14,
    fontWeight: '900',
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
