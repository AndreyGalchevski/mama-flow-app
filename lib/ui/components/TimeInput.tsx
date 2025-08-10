import React, { useState } from 'react';
import { FlatList, View } from 'react-native';

import { Button } from './Button';
import { Modal } from './Modal';
import { TextInput } from './TextInput';

export function TimeInput({
  label = 'Time',
  value,
  onChange,
  is24h = true,
}: {
  label?: string;
  value: { hours: number; minutes: number } | null;
  onChange: (tm: { hours: number; minutes: number } | null) => void;
  is24h?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const hours = Array.from({ length: is24h ? 24 : 12 }, (_, i) => (is24h ? i : (i + 1) % 12 || 12));
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const h = value?.hours ?? 0;
  const m = value?.minutes ?? 0;

  return (
    <>
      <TextInput
        label={label}
        value={value ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}` : ''}
        onChangeText={() => {}}
        placeholder={is24h ? 'HH:MM' : 'hh:mm'}
        trailing={
          <Button variant="text" onPress={() => setOpen(true)}>
            Pick
          </Button>
        }
      />
      <Modal visible={open} onRequestClose={() => setOpen(false)}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Wheel
            data={hours}
            selected={h}
            onSelect={(v) => onChange({ hours: Number(v), minutes: m })}
            width={100}
            formatter={(v) => String(v).padStart(2, '0')}
          />
          <Wheel
            data={minutes}
            selected={m}
            onSelect={(v) => onChange({ hours: h, minutes: Number(v) })}
            width={100}
            formatter={(v) => String(v).padStart(2, '0')}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <Button variant="text" onPress={() => setOpen(false)}>
            Close
          </Button>
        </View>
      </Modal>
    </>
  );
}

function Wheel({
  data,
  selected,
  onSelect,
  width = 100,
  formatter,
}: {
  data: (number | string)[];
  selected: number | string;
  onSelect: (v: number | string) => void;
  width?: number;
  formatter?: (v: number | string) => string;
}) {
  return (
    <View style={{ width, height: 200 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item)}
        getItemLayout={(_, index) => ({ length: 40, offset: 40 * index, index })}
        initialScrollIndex={Math.max(
          data.findIndex((v) => v === selected),
          0,
        )}
        renderItem={({ item }) => (
          <Button
            variant={item === selected ? 'tonal' : 'text'}
            onPress={() => onSelect(item)}
            style={{ borderRadius: 0, height: 40, justifyContent: 'center' }}
          >
            {formatter ? formatter(item) : String(item)}
          </Button>
        )}
      />
    </View>
  );
}
