import { View } from 'react-native';
import { COLORS } from '../../lib/colors';
import Tabs from '../../lib/components/Tabs';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        labeled={false}
        tabBarStyle={{ backgroundColor: COLORS.surface }}
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
