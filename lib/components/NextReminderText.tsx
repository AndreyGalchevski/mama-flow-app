import { Text } from 'react-native-paper';

import { formatNextReminder } from '../date';
import { useSettingsStore } from '../hooks/useSettingsStore';
import i18n from '../i18n';

export default function NextReminderText() {
  const remindersEnabled = useSettingsStore((s) => s.remindersEnabled);
  const nextReminderAt = useSettingsStore((s) => s.nextReminderAt);

  return (
    remindersEnabled &&
    nextReminderAt && (
      <Text style={{ marginTop: 8, color: '#999' }}>
        {i18n.t('reminders.nextReminderShort', {
          time: formatNextReminder(new Date(nextReminderAt)),
        })}
      </Text>
    )
  );
}
