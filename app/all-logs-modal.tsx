import { Stack, useRouter } from 'expo-router';
import { FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '../lib/colors';
import PumpCard from '../lib/components/PumpCard';
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
        renderItem={({ item }) => <PumpCard item={item} />}
      />

      <Button onPress={() => router.back()} style={{ marginTop: 8 }}>
        Close
      </Button>
    </SafeAreaView>
  );
}
