import { z } from 'zod';
import i18n from '../i18n';

const positiveVolume = z.number().finite().gt(0, i18n.t('validation.positive'));

const durationMinutes = z
  .number()
  .int(i18n.t('validation.integer'))
  .gte(1, i18n.t('validation.minMinutes', { min: 1 }))
  .lte(600, i18n.t('validation.maxMinutes'));

const timestamp = z
  .number()
  .int(i18n.t('validation.invalidTimestamp'))
  .positive(i18n.t('validation.invalidTimestamp'));

export const pumpLogFormSchema = z.object({
  volumeLeftML: positiveVolume,
  volumeRightML: positiveVolume,
  durationMinutes,
  notes: z
    .string()
    .trim()
    .max(500, i18n.t('validation.maxLength', { max: 500 }))
    .optional()
    .default(''),
  timestamp,
});

export type PumpLogFormInput = z.infer<typeof pumpLogFormSchema>;

export const pumpLogCSVRowSchema = z.object({
  timestamp,
  volumeLeftML: positiveVolume,
  volumeRightML: positiveVolume,
  durationMinutes,
  notes: z
    .string()
    .trim()
    .max(500, i18n.t('validation.maxLength', { max: 500 }))
    .optional()
    .default(''),
});

export type PumpLogCSVRow = z.infer<typeof pumpLogCSVRowSchema>;
