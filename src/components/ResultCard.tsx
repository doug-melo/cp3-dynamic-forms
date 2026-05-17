import { StyleSheet, Text, View } from 'react-native';
import { FieldConfig, FormValues } from '../types/form';
import { formatValue } from '../utils/formUtils';

interface ResultCardProps {
  fields: FieldConfig[];
  values: FormValues | null;
}

export function ResultCard({ fields, values }: ResultCardProps) {
  if (values === null) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultado salvo</Text>
      {fields.map((field) => (
        <View key={field.id} style={styles.row}>
          <Text style={styles.label}>{field.label}</Text>
          <Text style={styles.value}>{formatValue(field, values[field.id])}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D5E4DF',
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  title: {
    color: '#0F766E',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  row: {
    borderTopColor: '#E2E8F0',
    borderTopWidth: 1,
    gap: 4,
    paddingTop: 10,
  },
  label: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  value: {
    color: '#111827',
    fontSize: 15,
    lineHeight: 21,
  },
});
