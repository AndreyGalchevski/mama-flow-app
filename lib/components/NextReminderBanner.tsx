import { View } from 'react-native';
import { Banner, Text } from 'react-native-paper';

import { formatNextReminder } from '../date';
import { useSettingsStore } from '../hooks/useSettingsStore';
import Bell from '../icons/Bell';

export default function NextReminderBanner() {
  const remindersEnabled = useSettingsStore((s) => s.remindersEnabled);
  const nextReminderAt = useSettingsStore((s) => s.nextReminderAt);

  return (
    <Banner visible={remindersEnabled && !!nextReminderAt} contentStyle={{ padding: 2 }}>
      {remindersEnabled && !!nextReminderAt && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Bell size={24} />

          <Text>Next Reminder: {formatNextReminder(new Date(nextReminderAt))}</Text>
        </View>
      )}
    </Banner>
  );
}
