import { StyleSheet } from 'react-native';
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
      <Text style={styles.text}>
        {i18n.t('reminders.nextReminderShort', {
          time: formatNextReminder(new Date(nextReminderAt)),
        })}
      </Text>
    )
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 8,
    color: '#999',
  },
});
