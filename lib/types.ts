export interface PumpLog {
  id: string;
  timestamp: number;
  volumeLeftML: number;
  volumeRightML: number;
  volumeTotalML: number;
  durationMinutes: number;
  notes?: string;
}
