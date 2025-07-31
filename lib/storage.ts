import { MMKV } from 'react-native-mmkv';
import type { PersistStorage } from 'zustand/middleware';

const mmkv = new MMKV();

export default function getStorage<T>(): PersistStorage<T> {
  return {
    getItem: (key) => {
      const value = mmkv.getString(key);
      return value ? JSON.parse(value) : null;
    },
    setItem: (key, value) => mmkv.set(key, JSON.stringify(value)),
    removeItem: (key) => mmkv.delete(key),
  };
}
