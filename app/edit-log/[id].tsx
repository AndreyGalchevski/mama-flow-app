import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';

import PumpLogForm, { type PumpLogFormData } from '../../lib/components/PumpLogForm';
import { useLogsStore } from '../../lib/hooks/useLogsStore';
import { scheduleNextPumpReminder } from '../../lib/reminders';

export default function UpdateLogModal() {
  const { id } = useLocalSearchParams();

  const router = useRouter();
  const logs = useLogsStore((s) => s.logs);
  const updateLog = useLogsStore((s) => s.update);

  const currentLog = useMemo(() => logs.find((log) => log.id === id), [logs, id]);

  const handleSave = async ({
    volumeLeftML,
    volumeRightML,
    durationMinutes,
    notes,
    timestamp,
  }: PumpLogFormData) => {
    updateLog(id as string, {
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

  return <PumpLogForm initialState={currentLog} onSave={handleSave} />;
}
