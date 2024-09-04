import { type BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import { type NativeStackHeaderProps } from '@react-navigation/native-stack'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { useCommon } from '~/hooks/common'

import { Text } from '../common/text'
import { View } from '../common/view'
import { HeaderButton } from './header-button'

type Props = NativeStackHeaderProps | BottomTabHeaderProps

export function Header({ navigation, options, ...props }: Props) {
  const common = useCommon()

  const { styles } = useStyles(stylesheet)

  const back = 'back' in props ? Boolean(props.back) : false
  const left = back || options.headerLeft

  return (
    <View pt={common.insets.top} style={styles.main}>
      <View align="center" height="8" justify="center">
        {left ? (
          <View style={[styles.actions, styles.left]}>
            {back ? (
              <HeaderButton
                icon="ArrowLeft"
                onPress={() => {
                  navigation.goBack()
                }}
                weight="bold"
              />
            ) : null}

            {options.headerLeft?.({
              canGoBack: back,
            })}
          </View>
        ) : null}

        {typeof options.headerTitle === 'function' ? (
          <View direction="row" gap="2">
            {options.headerTitle({
              children: options.title ?? '',
            })}
          </View>
        ) : (
          <Text weight="bold">{options.title}</Text>
        )}

        {options.headerRight ? (
          <View style={[styles.actions, styles.right]}>
            {options.headerRight({
              canGoBack: back,
            })}
          </View>
        ) : null}
      </View>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  actions: {
    bottom: 0,
    flexDirection: 'row',
    position: 'absolute',
  },
  left: {
    left: 0,
  },
  main: {
    backgroundColor: theme.colors.gray[1],
  },
  right: {
    right: 0,
  },
}))
