import { StyleSheet, View } from 'react-native';
import { Button, Card, Icon, Modal, Portal, Text } from 'react-native-paper';

import { useMarkWelcomeSeen, useShowWelcome } from '../hooks/useFirstTimeUser';
import i18n from '../i18n';
import ShieldCheck from '../icons/ShieldCheck';

const FeatureRow = ({
  icon,
  title,
  description,
}: { icon: string; title: string; description: string }) => (
  <View style={styles.featureRow}>
    <Icon source={icon} size={24} />

    <View style={styles.featureText}>
      <Text variant="titleSmall" style={styles.featureTitle}>
        {title}
      </Text>
      <Text variant="bodyMedium" style={styles.featureDescription}>
        {description}
      </Text>
    </View>
  </View>
);

export default function WelcomeModal() {
  const showWelcome = useShowWelcome();
  const markWelcomeSeen = useMarkWelcomeSeen();

  return (
    <Portal>
      <Modal
        visible={showWelcome}
        onDismiss={markWelcomeSeen}
        contentContainerStyle={styles.container}
      >
        <Card>
          <Card.Content style={styles.content}>
            <View style={styles.header}>
              <ShieldCheck size={48} />

              <Text variant="headlineSmall" style={styles.title}>
                {i18n.t('welcome.title')}
              </Text>

              <Text variant="titleMedium" style={styles.subtitle}>
                {i18n.t('welcome.subtitle')}
              </Text>
            </View>

            <View style={styles.privacySection}>
              <FeatureRow
                icon="cellphone-lock"
                title={i18n.t('welcome.features.dataOwnership.title')}
                description={i18n.t('welcome.features.dataOwnership.description')}
              />

              <FeatureRow
                icon="account-off"
                title={i18n.t('welcome.features.noAccount.title')}
                description={i18n.t('welcome.features.noAccount.description')}
              />

              <FeatureRow
                icon="cloud-off-outline"
                title={i18n.t('welcome.features.noCloud.title')}
                description={i18n.t('welcome.features.noCloud.description')}
              />
            </View>

            <View style={styles.footer}>
              <Text variant="bodySmall" style={styles.disclaimer}>
                {i18n.t('welcome.disclaimer')}
              </Text>
            </View>
          </Card.Content>

          <Card.Actions style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Button mode="contained" onPress={markWelcomeSeen}>
              {i18n.t('welcome.startButton')}
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    marginTop: 16,
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  privacySection: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  featureText: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    marginBottom: 4,
    fontWeight: '600',
  },
  featureDescription: {
    opacity: 0.8,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
  },
  disclaimer: {
    textAlign: 'center',
    opacity: 0.7,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
