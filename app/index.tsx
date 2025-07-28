import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { FlatList } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../lib/colors';
import { isInLast24Hours } from '../lib/date';
import { useLogsStore } from '../lib/hooks/useLogsStore';

export default function Home() {
  const router = useRouter();
  const logs = useLogsStore((s) => s.logs);
  const recentLogs = logs.filter((l) => isInLast24Hours(l.timestamp));

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: COLORS.background }}>
      <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Last 24 Hours
      </Text>

      <FlatList
        data={recentLogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 8 }}>
            <Card.Title title={`Side: ${item.side}`} subtitle={format(item.timestamp, 'PPpp')} />
            <Card.Content>
              <Text>Volume: {item.volumeML} ml</Text>
              <Text>Duration: {item.durationMinutes} min</Text>
              {item.notes ? <Text>Notes: {item.notes}</Text> : null}
            </Card.Content>
          </Card>
        )}
      />

      <Button
        mode="contained"
        onPress={() => router.push('/add-log-modal')}
        style={{ marginTop: 16 }}
      >
        + Add Log
      </Button>

      <Button onPress={() => router.push('/all-logs-modal')} style={{ marginTop: 8 }}>
        View All Logs
      </Button>
    </SafeAreaView>
  );
}
