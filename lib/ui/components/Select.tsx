import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { Button } from './Button';
import { Modal } from './Modal';

export function Select<T extends string | number>({
  label,
  options,
  value,
  onChange,
  style,
}: {
  label: string;
  options: { label: string; value: T }[];
  value?: T;
  onChange: (v: T) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value)?.label ?? '';
  return (
    <>
      <Button variant="outlined" onPress={() => setOpen(true)} style={style}>
        {selected || label}
      </Button>
      <Modal visible={open} onRequestClose={() => setOpen(false)}>
        <View style={{ gap: 4 }}>
          {options.map((opt) => (
            <Button
              key={String(opt.value)}
              variant={opt.value === value ? 'tonal' : 'text'}
              onPress={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </Button>
          ))}
        </View>
      </Modal>
    </>
  );
}
