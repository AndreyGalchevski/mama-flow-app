import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../lib/colors';
import Tabs from '../../lib/components/Tabs';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        labeled={false}
        tabBarStyle={styles.tabBar}
        tabBarActiveTintColor={COLORS.onPrimary}
        activeIndicatorColor={COLORS.primary}
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
  tabBar: {
    backgroundColor: COLORS.surface,
  },
});
