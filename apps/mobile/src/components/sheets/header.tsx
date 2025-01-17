import { type ReactNode } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

type Props = {
  right?: ReactNode
  style?: StyleProp<ViewStyle>
  title: string
}

export function SheetHeader({ right, style, title }: Props) {
  const { themeBackground, themeOled } = usePreferences()

  const { styles } = useStyles(stylesheet)

  return (
    <View
      align="center"
      height="8"
      justify="center"
      style={[styles.main(themeOled, themeBackground), style]}
    >
      <Text weight="bold">{title}</Text>

      {right ? <View style={[styles.right]}>{right}</View> : null}
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: (oled: boolean, bg: boolean) => ({
    backgroundColor: oled
      ? oledTheme[theme.name].bg
      : theme.colors[bg ? 'accent' : 'gray'].bgAlt,
  }),
  right: {
    bottom: 0,
    position: 'absolute',
    right: 0,
  },
}))
