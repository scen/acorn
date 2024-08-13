import { Tabs } from 'expo-router'
import { useTranslations } from 'use-intl'

import { Icon } from '~/components/common/icon'
import { CommunitiesHeader } from '~/components/communities/header'
import { Header } from '~/components/navigation/header'
import { TabBar } from '~/components/navigation/tab-bar'
import { SearchHeader } from '~/components/search/header'
import { AccountSwitchCard } from '~/components/users/switch'

export default function Layout() {
  const t = useTranslations('tab')

  return (
    <Tabs
      screenOptions={{
        header: (props) => <Header {...props} />,
        lazy: true,
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: (props) => (
            <Icon {...props} name="House" weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          header: () => <SearchHeader />,
          tabBarIcon: (props) => (
            <Icon {...props} name="MagnifyingGlass" weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="user"
        options={{
          headerRight: () => <AccountSwitchCard />,
          tabBarIcon: (props) => (
            <Icon {...props} name="UserCircle" weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="communities"
        options={{
          header: () => <CommunitiesHeader />,
          tabBarIcon: (props) => (
            <Icon {...props} name="UsersFour" weight="duotone" />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: (props) => (
            <Icon {...props} name="GearSix" weight="duotone" />
          ),
          title: t('settings.title'),
        }}
      />
    </Tabs>
  )
}
