import { StyleSheet, View } from 'react-native';
import { Banner, Text } from 'react-native-paper';

import { useRouter } from 'expo-router';
import { formatNextReminder } from '../date';
import { useSettingsStore } from '../hooks/useSettingsStore';
import i18n from '../i18n';
import Bell from '../icons/Bell';
import { snoozeNextPumpReminder } from '../reminders';

export default function NextReminderBanner() {
  const router = useRouter();

  const remindersEnabled = useSettingsStore((s) => s.remindersEnabled);
  const nextReminderAt = useSettingsStore((s) => s.nextReminderAt);

  return (
    <Banner
      visible={remindersEnabled && !!nextReminderAt}
      contentStyle={styles.bannerContent}
      actions={[
        {
          label: i18n.t('reminders.snooze10m'),
          onPress: () => {
            snoozeNextPumpReminder(10).catch(console.error);
          },
        },
        {
          label: 'Configure',
          onPress: () => router.push('/(tabs)/settings'),
        },
      ]}
    >
      {remindersEnabled && !!nextReminderAt && (
        <View style={styles.container}>
          <Bell size={24} />

          <Text>
            {i18n.t('reminders.nextReminder', {
              time: formatNextReminder(new Date(nextReminderAt)),
            })}
          </Text>
        </View>
      )}
    </Banner>
  );
}

const styles = StyleSheet.create({
  bannerContent: {
    padding: 2,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
