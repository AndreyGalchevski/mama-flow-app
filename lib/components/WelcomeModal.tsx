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

          <Card.Actions style={styles.cardActions}>
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
    flex: 1,
    padding: 24,
  },
  content: {
    paddingVertical: 24,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  privacySection: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    flex: 1,
    marginStart: 16,
  },
  featureTitle: {
    marginBottom: 4,
  },
  featureDescription: {
    opacity: 0.7,
  },
  footer: {
    marginTop: 16,
  },
  disclaimer: {
    textAlign: 'center',
    opacity: 0.6,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingTop: 24,
  },
  cardActions: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24,
  },
});
