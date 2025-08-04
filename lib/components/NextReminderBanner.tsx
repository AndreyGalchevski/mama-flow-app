import { View } from 'react-native';
import { Banner, Text } from 'react-native-paper';

import { formatNextReminder } from '../date';
import { useSettingsStore } from '../hooks/useSettingsStore';

export default function NextReminderBanner() {
  const remindersEnabled = useSettingsStore((s) => s.remindersEnabled);
  const nextReminderAt = useSettingsStore((s) => s.nextReminderAt);

  return (
    <Banner visible={remindersEnabled && !!nextReminderAt} icon="clock-outline">
      <View style={{ padding: 8 }}>
        {nextReminderAt && (
          <Text>Next Reminder: {formatNextReminder(new Date(nextReminderAt))}</Text>
        )}
      </View>
    </Banner>
  );
}
