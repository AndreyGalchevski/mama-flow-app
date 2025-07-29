import { format } from 'date-fns';
import { Alert } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';

import { useLogsStore } from '../hooks/useLogsStore';
import type { PumpLog } from '../types';

interface Props {
  item: PumpLog;
}

export default function PumpCard({ item }: Props) {
  const handleDeleteConfirm = () => {
    const logs = useLogsStore.getState().logs;
    const newLogs = logs.filter((l) => l.id !== item.id);
    useLogsStore.setState({ logs: newLogs });
  };

  return (
    <Card style={{ marginBottom: 8 }}>
      <Card.Title
        title={format(item.timestamp, 'PPpp')}
        right={(props) => (
          <IconButton
            {...props}
            icon="delete"
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
          />
        )}
      />
      <Card.Content>
        <Text>Volume: {item.volumeLeftML + item.volumeRightML} ml</Text>
        <Text>Duration: {item.durationMinutes} min</Text>
        {item.notes ? <Text>Notes: {item.notes}</Text> : null}
      </Card.Content>
    </Card>
  );
}
