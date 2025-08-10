import React, { useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from './Button';
import { Modal } from './Modal';
import { TextInput } from './TextInput';

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export function DateInput({
  label = 'Date',
  value,
  onChange,
  minDate,
  maxDate,
  displayFormat,
}: {
  label?: string;
  value: Date | null;
  onChange: (d: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  displayFormat?: (d: Date) => string;
}) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  const dateText = value
    ? displayFormat
      ? displayFormat(value)
      : `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`
    : '';

  // Simple ranges (years ±50)
  const current = value ?? new Date();
  const years = useMemo(() => {
    const y0 = minDate?.getFullYear() ?? current.getFullYear() - 50;
    const y1 = maxDate?.getFullYear() ?? current.getFullYear() + 50;
    return Array.from({ length: y1 - y0 + 1 }, (_, i) => y0 + i);
  }, [current, minDate, maxDate]);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate();

  const [y, setY] = useState(current.getFullYear());
  const [m, setM] = useState(current.getMonth() + 1);
  const [d, setD] = useState(current.getDate());

  const confirm = () => {
    const nd = new Date(y, m - 1, Math.min(d, daysInMonth(y, m)));
    onChange(nd);
    setOpen(false);
  };

  return (
    <>
      <TextInput
        label={label}
        value={dateText}
        onChangeText={() => {}}
        placeholder="YYYY-MM-DD"
        trailing={
          <Button variant="text" onPress={() => setOpen(true)}>
            Pick
          </Button>
        }
      />
      <Modal visible={open} onRequestClose={() => setOpen(false)}>
        <Text style={[t.typography.titleLarge, { color: t.colors.onSurface, marginBottom: 8 }]}>
          Pick a date
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Wheel data={years} selected={y} onSelect={(v) => setY(Number(v))} width={100} />
          <Wheel
            data={months}
            selected={m}
            onSelect={(v) => setM(Number(v))}
            width={80}
            formatter={(v) => pad(v as number)}
          />
          <Wheel
            data={Array.from({ length: daysInMonth(y, m) }, (_, i) => i + 1)}
            selected={d}
            onSelect={(v) => setD(Number(v))}
            width={80}
            formatter={(v) => pad(v as number)}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
          <Button variant="text" onPress={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onPress={confirm}>OK</Button>
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
  const t = useTheme();
  return (
    <View
      style={{
        width,
        height: 200,
        borderRadius: t.shape.md,
        backgroundColor: t.colors.surfaceContainer,
        overflow: 'hidden',
      }}
    >
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
