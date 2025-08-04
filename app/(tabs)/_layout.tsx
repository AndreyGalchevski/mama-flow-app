import { COLORS } from '../../lib/colors';
import Tabs from '../../lib/components/Tabs';

export default function TabLayout() {
  return (
    <Tabs
      {...{
        labeled: true,
        tabBarStyle: {
          backgroundColor: COLORS.background,
        },
        tabBarActiveTintColor: COLORS.primary,
        activeIndicatorColor: COLORS.onPrimary,
      }}
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
  );
}
