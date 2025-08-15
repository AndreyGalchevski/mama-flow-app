import { StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

import { useRatingPrompt } from '../hooks/useRatingPrompt';
import { useSettingsStore } from '../hooks/useSettingsStore';
import i18n from '../i18n';

interface RatingPromptDialogProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function RatingPromptDialog({ visible, onDismiss }: RatingPromptDialogProps) {
  const { showRatingPrompt } = useRatingPrompt();
  const markRatingPromptShown = useSettingsStore((state) => state.markRatingPromptShown);

  const handleRateNow = async () => {
    onDismiss();
    await showRatingPrompt();
  };

  const handleNotNow = () => {
    markRatingPromptShown();
    onDismiss();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleNotNow} style={styles.dialog}>
        <Dialog.Title>
          <Text variant="titleLarge">{i18n.t('rating.title')}</Text>
        </Dialog.Title>

        <Dialog.Content>
          <Text variant="bodyMedium">{i18n.t('rating.message')}</Text>
        </Dialog.Content>

        <Dialog.Actions style={styles.actions}>
          <Button onPress={handleNotNow}>{i18n.t('rating.notNow')}</Button>
          <Button mode="contained" onPress={handleRateNow}>
            {i18n.t('rating.rateNow')}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    marginHorizontal: 24,
    borderRadius: 12,
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});
