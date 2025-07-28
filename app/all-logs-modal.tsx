import { format } from 'date-fns';
import { Stack, useRouter } from 'expo-router';
import { Alert, FlatList } from 'react-native';
import { Button, Card, IconButton, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../lib/colors';
import { useLogsStore } from '../lib/hooks/useLogsStore';

export default function AllLogsModal() {
  const router = useRouter();
  const logs = useLogsStore((s) => s.logs);

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: COLORS.background }}>
      <Stack.Screen options={{ title: 'All Logs', presentation: 'modal' }} />

      <FlatList
        data={[...logs].sort((a, b) => b.timestamp - a.timestamp)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 8 }}>
            <Card.Title
              title={`Side: ${item.side}`}
              subtitle={format(item.timestamp, 'PPpp')}
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
                        onPress: () => {
                          const logs = useLogsStore.getState().logs;
                          const newLogs = logs.filter((l) => l.id !== item.id);
                          useLogsStore.setState({ logs: newLogs });
                        },
                      },
                    ])
                  }
                />
              )}
            />
            <Card.Content>
              <Text>Volume: {item.volumeML} ml</Text>
              <Text>Duration: {item.durationMinutes} min</Text>
              {item.notes ? <Text>Notes: {item.notes}</Text> : null}
            </Card.Content>
          </Card>
        )}
      />

      <Button onPress={() => router.back()} style={{ marginTop: 8 }}>
        Close
      </Button>
    </SafeAreaView>
  );
}
