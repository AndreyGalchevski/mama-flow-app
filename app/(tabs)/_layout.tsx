import { Platform, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import Tabs from '../../lib/components/Tabs';

export default function TabLayout() {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <Tabs
        labeled={false}
        tabBarStyle={{ backgroundColor: theme.colors.surface }}
        tabBarActiveTintColor={
          Platform.OS === 'android' ? theme.colors.onPrimary : theme.colors.primary
        }
        activeIndicatorColor={theme.colors.primary}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '',
            tabBarIcon: () => require('../../assets/images/tabs/home.svg'),
          }}
        />
        <Tabs.Screen
          name="all-logs"
          options={{
            title: '',
            tabBarIcon: () => require('../../assets/images/tabs/all-logs.svg'),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: '',
            tabBarIcon: () => require('../../assets/images/tabs/settings.svg'),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {},
});
