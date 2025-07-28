import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, HelperText, RadioButton, Text, TextInput } from 'react-native-paper';
import { v4 as uuidv4 } from 'uuid';

import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../lib/colors';
import { useLogsStore } from '../lib/hooks/useLogsStore';
import type { PumpLog, PumpSide } from '../lib/types';

export default function AddLogModal() {
  const router = useRouter();
  const addLog = useLogsStore((s) => s.add);

  const [side, setSide] = useState<PumpSide>('left');
  const [volume, setVolume] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!volume || !duration) return;

    const log: PumpLog = {
      id: uuidv4(),
      timestamp: Date.now(),
      side,
      volumeML: Number.parseFloat(volume),
      durationMinutes: Number.parseFloat(duration),
      notes: notes.trim(),
    };

    addLog(log);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: COLORS.background }}>
      <Stack.Screen options={{ title: 'Add Pump Log', presentation: 'modal' }} />

      <Text variant="titleMedium" style={{ marginBottom: 8 }}>
        Pumped Side
      </Text>
      <RadioButton.Group onValueChange={(value) => setSide(value as PumpSide)} value={side}>
        <RadioButton.Item label="Left" value="left" />
        <RadioButton.Item label="Right" value="right" />
        <RadioButton.Item label="Both" value="both" />
      </RadioButton.Group>

      <TextInput
        label="Volume (ml)"
        value={volume}
        keyboardType="numeric"
        onChangeText={setVolume}
        style={{ marginTop: 16 }}
      />
      <HelperText type="error" visible={!volume}>
        Volume is required
      </HelperText>

      <TextInput
        label="Duration (minutes)"
        value={duration}
        keyboardType="numeric"
        onChangeText={setDuration}
        style={{ marginTop: 8 }}
      />
      <HelperText type="error" visible={!duration}>
        Duration is required
      </HelperText>

      <TextInput
        label="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        multiline
        style={{ marginTop: 8 }}
      />

      <Button
        mode="contained"
        onPress={handleSave}
        disabled={!volume || !duration}
        style={{ marginTop: 16 }}
      >
        Save
      </Button>

      <Button onPress={() => router.back()} style={{ marginTop: 8 }}>
        Cancel
      </Button>
    </SafeAreaView>
  );
}
