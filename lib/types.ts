export type PumpSide = 'left' | 'right' | 'both';

export interface PumpLog {
  id: string;
  timestamp: number;
  side: PumpSide;
  volumeML: number;
  durationMinutes: number;
  notes?: string;
}
