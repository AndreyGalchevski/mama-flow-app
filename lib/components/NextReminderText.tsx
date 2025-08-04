import { Text } from 'react-native-paper';

import { formatNextReminder } from '../date';
import { useSettingsStore } from '../hooks/useSettingsStore';

export default function NextReminderText() {
  const remindersEnabled = useSettingsStore((s) => s.remindersEnabled);
  const nextReminderAt = useSettingsStore((s) => s.nextReminderAt);

  return (
    remindersEnabled &&
    nextReminderAt && (
      <Text style={{ marginTop: 8, color: '#999' }}>
        Next reminder: {formatNextReminder(new Date(nextReminderAt))}
      </Text>
    )
  );
}
