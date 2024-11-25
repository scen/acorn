import { Tabs } from 'expo-router'

import { Icon } from '~/components/common/icon'
import { TabBar } from '~/components/navigation/tab-bar'
import { useUnread } from '~/hooks/queries/user/unread'

export default function Layout() {
  const { unread } = useUnread()

  return (
    <Tabs
      screenOptions={{
        animation: 'fade',
        headerShown: false,
        lazy: true,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: (props) => (
            <Icon {...props} name="House" weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="(search)"
        options={{
          tabBarIcon: (props) => (
            <Icon {...props} name="MagnifyingGlass" weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="(profile)"
        options={{
          tabBarIcon: (props) => (
            <Icon {...props} name="UserCircle" weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="(notifications)"
        options={{
          tabBarBadge: unread,
          tabBarIcon: (props) => (
            <Icon {...props} name="Bell" weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="(communities)"
        options={{
          tabBarIcon: (props) => (
            <Icon {...props} name="UsersFour" weight="duotone" />
          ),
        }}
      />
    </Tabs>
  )
}
