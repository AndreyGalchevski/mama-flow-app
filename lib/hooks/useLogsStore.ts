import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import getStorage from '../storage';
import type { PumpLog } from '../types';

type LogsState = {
  logs: PumpLog[];
  add: (log: PumpLog) => void;
  clear: () => void;
};

export const useLogsStore = create<LogsState>()(
  persist(
    (set, get) => ({
      logs: [],
      add: (log) => set({ logs: [...get().logs, log] }),
      clear: () => set({ logs: [] }),
    }),
    {
      name: 'pumpLogs',
      storage: getStorage<LogsState>(),
    },
  ),
);
