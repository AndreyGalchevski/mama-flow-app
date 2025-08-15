import { create } from 'zustand';
import i18n from '../i18n';

import type { SnackbarType } from '../types';

interface SnackbarPayloadSuccess {
  type: 'success';
  message: string;
}

interface SnackbarPayloadError {
  type: 'error';
  error: unknown;
}

type SnackbarPayload = SnackbarPayloadSuccess | SnackbarPayloadError;

export interface SnackbarState {
  isSnackbarVisible: boolean;
  snackbarType: SnackbarType;
  snackbarMessage: string;
  showSnackbar: (payload: SnackbarPayload) => void;
  hideSnackbar: () => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => {
  return {
    isSnackbarVisible: false,

    snackbarType: 'success',

    snackbarMessage: '',

    showSnackbar: (payload) => {
      if (payload.type === 'success') {
        set({ isSnackbarVisible: true, snackbarMessage: payload.message, snackbarType: 'success' });
        return;
      }

      if (typeof payload.error === 'string') {
        set({
          isSnackbarVisible: true,
          snackbarMessage: payload.error,
          snackbarType: 'error',
        });
        return;
      }

      if (payload.error instanceof Error) {
        set({
          isSnackbarVisible: true,
          snackbarMessage: payload.error.message || i18n.t('snackbar.genericError'),
          snackbarType: 'error',
        });
        return;
      }

      set({
        isSnackbarVisible: true,
        snackbarMessage: i18n.t('snackbar.genericError'),
        snackbarType: 'error',
      });
    },

    hideSnackbar: () => {
      set({ isSnackbarVisible: false, snackbarMessage: '' });
    },
  };
});
