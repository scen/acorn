import { Pressable } from 'react-native'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import { useReorderableDrag } from 'react-native-reorderable-list'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { type Account } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'
import { oledTheme } from '~/styles/oled'

import { Icon } from '../common/icon'
import { IconButton } from '../common/icon-button'
import { Text } from '../common/text'

type Props = {
  account: Account
  onChange: (id: string) => void
  onClose: () => void
  onRemove: (id: string) => void
  selected?: string
}

export function AccountCard({
  account,
  onChange,
  onClose,
  onRemove,
  selected,
}: Props) {
  const { themeOled, themeTint } = usePreferences()

  const drag = useReorderableDrag()

  const { styles, theme } = useStyles(stylesheet)

  return (
    <Swipeable
      containerStyle={styles.delete}
      key={account.id}
      renderLeftActions={() => (
        <IconButton
          contrast
          icon={{
            name: 'Trash',
          }}
          onPress={() => {
            onRemove(account.id)
          }}
        />
      )}
      renderRightActions={() => null}
    >
      <Pressable
        onLongPress={drag}
        onPress={() => {
          if (account.id !== selected) {
            onChange(account.id)
          }

          onClose()
        }}
        style={[
          styles.main(themeOled, themeTint),
          account.id === selected && styles.selected,
        ]}
      >
        <Icon
          color={theme.colors.gray.accent}
          name="DotsSixVertical"
          size={theme.space[4]}
          weight="bold"
        />

        <Text weight="medium">{account.id}</Text>
      </Pressable>
    </Swipeable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  delete: {
    backgroundColor: theme.colors.red.accent,
  },
  main: (oled: boolean, tint: boolean) => ({
    alignItems: 'center',
    backgroundColor: oled
      ? oledTheme[theme.name].bg
      : theme.colors[tint ? 'accent' : 'gray'].bg,
    flexDirection: 'row',
    gap: theme.space[3],
    padding: theme.space[3],
  }),
  selected: {
    backgroundColor: theme.colors.accent.uiActive,
  },
}))
