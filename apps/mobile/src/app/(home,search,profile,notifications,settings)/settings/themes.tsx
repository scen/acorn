import { FlashList } from '@shopify/flash-list'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Switch } from '~/components/common/switch'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { SheetItem } from '~/components/sheets/item'
import { useList } from '~/hooks/list'
import { usePreferences } from '~/stores/preferences'
import { type ColorToken } from '~/styles/tokens'

export default function Screen() {
  const t = useTranslations('screen.settings.themes')

  const { theme, themeBackground, themeOled, update } = usePreferences()

  const { styles } = useStyles(stylesheet)

  const listProps = useList()

  const data = [
    t('preferences.title'),
    {
      key: 'themeOled',
      label: t('preferences.themeOled'),
      value: themeOled,
    },
    {
      key: 'themeBackground',
      label: t('preferences.themeBackground'),
      value: themeBackground,
    },
    null,

    t('auto.title'),
    {
      color: 'orange',
      key: 'acorn',
      label: t('auto.acorn'),
    },
    null,

    t('light.title'),
    {
      color: 'orange',
      key: 'acorn-light',
      label: t('light.acorn'),
    },
    {
      color: 'ruby',
      key: 'ruby-light',
      label: t('light.ruby'),
    },
    {
      color: 'plum',
      key: 'plum-light',
      label: t('light.plum'),
    },
    {
      color: 'indigo',
      key: 'indigo-light',
      label: t('light.indigo'),
    },
    {
      color: 'jade',
      key: 'jade-light',
      label: t('light.jade'),
    },
    null,

    t('dark.title'),
    {
      color: 'orange',
      key: 'acorn-dark',
      label: t('dark.acorn'),
    },
    {
      color: 'ruby',
      key: 'ruby-dark',
      label: t('dark.ruby'),
    },
    {
      color: 'plum',
      key: 'plum-dark',
      label: t('dark.plum'),
    },
    {
      color: 'indigo',
      key: 'indigo-dark',
      label: t('dark.indigo'),
    },
    {
      color: 'jade',
      key: 'jade-dark',
      label: t('dark.jade'),
    },
  ] as const

  return (
    <FlashList
      {...listProps}
      data={data}
      estimatedItemSize={48}
      renderItem={({ item }) => {
        if (item === null) {
          return <View height="4" />
        }

        if (typeof item === 'string') {
          return (
            <Text
              highContrast={false}
              mb="2"
              mt="3"
              mx="3"
              size="2"
              weight="medium"
            >
              {item}
            </Text>
          )
        }

        if ('color' in item) {
          return (
            <SheetItem
              label={item.label}
              onPress={() => {
                update({
                  theme: item.key,
                })
              }}
              right={
                <View
                  align="center"
                  height="6"
                  justify="center"
                  style={styles.icon(item.color)}
                  width="6"
                />
              }
              selected={item.key === theme}
            />
          )
        }

        return (
          <View align="center" direction="row" gap="3" height="8" px="3">
            <Text lines={1} style={styles.label} weight="medium">
              {item.label}
            </Text>

            <Switch
              onChange={(next) => {
                update({
                  [item.key]: next,
                })
              }}
              value={item.value}
            />
          </View>
        )
      }}
    />
  )
}

const stylesheet = createStyleSheet((theme) => ({
  header: {
    backgroundColor: theme.colors.gray.bgAlt,
  },
  icon: (color: ColorToken | 'acorn') => ({
    backgroundColor: theme.colors[color === 'acorn' ? 'orange' : color].accent,
    borderCurve: 'continuous',
    borderRadius: theme.space[5],
  }),
  item: (selected: boolean) => ({
    backgroundColor: selected ? theme.colors.accent.uiActive : undefined,
  }),
  label: {
    flex: 1,
  },
}))
