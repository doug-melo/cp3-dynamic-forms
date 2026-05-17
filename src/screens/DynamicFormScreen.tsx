import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DynamicField } from '../components/DynamicField';
import { ResultCard } from '../components/ResultCard';
import { formConfig } from '../config/formConfig';
import { useDynamicForm } from '../hooks/useDynamicForm';

export function DynamicFormScreen() {
  const { clearData, errors, hasStoredData, isLoading, submittedValues, submit, updateValue, values } =
    useDynamicForm(formConfig);

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', default: undefined })}
      style={styles.keyboardView}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.kicker}>CP3 React Native</Text>
            <Text style={styles.title}>{formConfig.title}</Text>
          </View>

          {isLoading ? (
            <View style={styles.loadingArea}>
              <ActivityIndicator color="#0F766E" size="large" />
            </View>
          ) : (
            <View style={styles.formArea}>
              {formConfig.fields.map((field) => (
                <DynamicField
                  error={errors[field.id]}
                  field={field}
                  key={field.id}
                  onChange={updateValue}
                  value={values[field.id]}
                />
              ))}

              <View style={styles.actions}>
                <Pressable onPress={submit} style={[styles.button, styles.primaryButton]}>
                  <Text style={[styles.buttonText, styles.primaryButtonText]}>Salvar</Text>
                </Pressable>
                <Pressable
                  disabled={!hasStoredData && submittedValues === null}
                  onPress={clearData}
                  style={[
                    styles.button,
                    styles.secondaryButton,
                    !hasStoredData && submittedValues === null && styles.disabledButton,
                  ]}
                >
                  <Text style={[styles.buttonText, styles.secondaryButtonText]}>Limpar</Text>
                </Pressable>
              </View>

              <ResultCard fields={formConfig.fields} values={submittedValues} />
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    backgroundColor: '#F4F7F6',
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingVertical: 28,
  },
  container: {
    alignSelf: 'center',
    maxWidth: 760,
    width: '100%',
  },
  header: {
    gap: 6,
    marginBottom: 22,
  },
  kicker: {
    color: '#0F766E',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 36,
  },
  loadingArea: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 220,
  },
  formArea: {
    gap: 18,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  button: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 50,
    minWidth: 132,
    paddingHorizontal: 18,
  },
  primaryButton: {
    backgroundColor: '#0F766E',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderWidth: 1,
  },
  disabledButton: {
    opacity: 0.45,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#334155',
  },
});
