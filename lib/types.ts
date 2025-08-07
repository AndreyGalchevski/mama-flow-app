export interface PumpLog {
  id: string;
  timestamp: number;
  volumeLeftML: number;
  volumeRightML: number;
  volumeTotalML: number;
  durationMinutes: number;
  notes?: string;
}

export interface DataPoint {
  timestamp: number;
  value: number;
  label: string;
  tooltip: string;
}
