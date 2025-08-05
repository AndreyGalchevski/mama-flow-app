import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';

import { AccessibilityHints, AccessibilityLabels } from '../accessibility';
import { COLORS } from '../colors';
import { useLogsStore } from '../hooks/useLogsStore';
import Trash from '../icons/Trash';
import { scheduleNextPumpReminder } from '../reminders';
import type { PumpLog } from '../types';

interface Props {
  item: PumpLog;
}

export default function PumpCard({ item }: Props) {
  const router = useRouter();

  const logs = useLogsStore((s) => s.logs);

  const handleDeleteConfirm = async () => {
    const newLogs = logs.filter((l) => l.id !== item.id);
    useLogsStore.setState({ logs: newLogs });
    scheduleNextPumpReminder().catch(console.error);
  };

  return (
    <Card
      style={{ marginBottom: 8 }}
      mode="contained"
      onPress={() => router.push(`/edit-log/${item.id}`)}
      accessible={true}
      accessibilityLabel={`Pump session from ${format(item.timestamp, 'PPp')}, ${item.volumeLeftML + item.volumeRightML} ml total`}
      accessibilityHint={AccessibilityHints.editPumpLog}
      accessibilityRole="button"
    >
      <Card.Title
        title={format(item.timestamp, 'PPp')}
        right={(props) => (
          <IconButton
            {...props}
            icon={() => <Trash size={24} color={COLORS.onBackground} />}
            onPress={() =>
              Alert.alert('Delete Entry?', 'This cannot be undone.', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: handleDeleteConfirm,
                },
              ])
            }
            accessible={true}
            accessibilityLabel={AccessibilityLabels.deletePumpLog}
            accessibilityHint={AccessibilityHints.deletePumpLog}
            accessibilityRole="button"
          />
        )}
      />
      <Card.Content>
        <Text
          accessibilityLabel={`Total volume: ${item.volumeLeftML + item.volumeRightML} milliliters`}
        >
          Volume: {item.volumeLeftML + item.volumeRightML} ml
        </Text>
        <Text accessibilityLabel={`Duration: ${item.durationMinutes} minutes`}>
          Duration: {item.durationMinutes} min
        </Text>
        {item.notes ? (
          <Text accessibilityLabel={`Notes: ${item.notes}`}>Notes: {item.notes}</Text>
        ) : null}
      </Card.Content>
    </Card>
  );
}
