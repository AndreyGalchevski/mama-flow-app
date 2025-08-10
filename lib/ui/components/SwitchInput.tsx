import { Switch, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export function SwitchInput({
  label,
  value,
  onValueChange,
  helperText,
  disabled,
}: {
  label?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  helperText?: string;
  disabled?: boolean;
}) {
  const t = useTheme();
  return (
    <View style={{ marginVertical: t.spacing(1) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          {label ? (
            <Text style={[t.typography.bodyLarge, { color: t.colors.onSurface }]}>{label}</Text>
          ) : null}
          {helperText ? (
            <Text style={[t.typography.bodySmall, { color: t.colors.onSurfaceVariant }]}>
              {helperText}
            </Text>
          ) : null}
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          thumbColor={value ? t.colors.onPrimary : undefined}
          trackColor={{ true: t.colors.primary, false: t.colors.outline }}
        />
      </View>
    </View>
  );
}
