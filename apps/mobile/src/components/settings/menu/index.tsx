import { type ReactElement } from 'react'
import { FlatList, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type IconName } from '~/components/common/icon'
import { RefreshControl } from '~/components/common/refresh-control'
import { Text } from '~/components/common/text'
import { useCommon } from '~/hooks/common'

import { SettingsItem } from './item'

export type SettingsItem = {
  arrow?: boolean
  icon: IconName
  label: string
  onPress?: () => void
} & (
  | {
      type?: undefined
    }
  | {
      onSelect: (value: string) => void
      options: Array<{
        icon?: IconName
        label: string
        value: string
      }>
      type: 'options'
      value?: string
    }
  | {
      onSelect: (value: boolean) => void
      type: 'switch'
      value: boolean
    }
)

type Props = {
  footer?: ReactElement
  header?: ReactElement
  insets?: Array<'header' | 'tabBar'>
  items: Array<SettingsItem | string | null>
  onRefresh?: () => Promise<unknown>
}

export function SettingsMenu({
  footer,
  header,
  insets,
  items,
  onRefresh,
}: Props) {
  const common = useCommon()

  const { styles } = useStyles(stylesheet)

  const hasHeader = insets?.includes('header')
  const hasTabBar = insets?.includes('tabBar')

  return (
    <FlatList
      {...common.listProps({
        header: hasHeader,
        tabBar: hasTabBar,
      })}
      ListFooterComponent={footer}
      ListHeaderComponent={header}
      contentContainerStyle={styles.main(
        hasHeader ? common.height.header : 0,
        hasTabBar ? common.height.tabBar : 0,
      )}
      data={items}
      keyExtractor={(item, index) => String(index)}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            offset={
              insets?.includes('header') ? common.height.header : undefined
            }
            onRefresh={onRefresh}
          />
        ) : undefined
      }
      renderItem={({ index, item }) => {
        if (item === null) {
          return <View style={styles.separator} />
        }

        if (typeof item === 'string') {
          return (
            <View style={[styles.header]}>
              <Text highContrast={false} size="2" weight="medium">
                {item}
              </Text>
            </View>
          )
        }

        return (
          <SettingsItem
            item={item}
            style={[
              index === 0 && styles.first,
              index === items.length - 1 && styles.last,
            ]}
          />
        )
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  first: {
    marginTop: theme.space[1],
  },
  header: {
    marginHorizontal: theme.space[3],
    marginVertical: theme.space[3],
  },
  last: {
    marginBottom: theme.space[1],
  },
  main: (top: number, bottom: number) => ({
    flex: 1,
    paddingBottom: bottom,
    paddingTop: top,
  }),
  separator: {
    height: theme.space[4],
  },
}))
