import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';

import PumpLogForm, { type PumpLogFormData } from '../lib/components/PumpLogForm';
import { useLogsStore } from '../lib/hooks/useLogsStore';
import { scheduleNextPumpReminder } from '../lib/reminders';

export default function AddLogModal() {
  const router = useRouter();
  const addLog = useLogsStore((s) => s.add);

  const handleSave = ({
    volumeLeftML,
    volumeRightML,
    durationMinutes,
    notes,
    timestamp,
  }: PumpLogFormData) => {
    addLog({
      id: Crypto.randomUUID(),
      timestamp,
      volumeLeftML,
      volumeRightML,
      volumeTotalML: volumeLeftML + volumeRightML,
      durationMinutes,
      notes,
    });

    scheduleNextPumpReminder().catch(console.error);

    router.back();
  };

  return <PumpLogForm onSave={handleSave} />;
}
