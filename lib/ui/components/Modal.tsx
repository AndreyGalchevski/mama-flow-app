import type { ReactNode } from 'react';
import { Modal as RNModal, View } from 'react-native';

import { useTheme } from '../theme/ThemeProvider';

export function Modal({
  visible,
  onRequestClose,
  children,
}: { visible: boolean; onRequestClose: () => void; children: ReactNode }) {
  const t = useTheme();
  return (
    <RNModal visible={visible} transparent animationType="slide" onRequestClose={onRequestClose}>
      <View style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'flex-end' }}>
        <View
          style={[
            {
              backgroundColor: t.colors.surfaceContainerHigh,
              borderTopLeftRadius: t.shape.xl,
              borderTopRightRadius: t.shape.xl,
              padding: t.spacing(2),
            },
            t.elevation.level3,
          ]}
        >
          {children}
        </View>
      </View>
    </RNModal>
  );
}
