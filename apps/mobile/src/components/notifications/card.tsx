import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useFormatter, useTranslations } from 'use-intl'

import { useLink } from '~/hooks/link'
import { useMarkAsRead } from '~/hooks/mutations/users/notifications'
import { type ColorToken } from '~/styles/tokens'
import { type Notification, type NotificationType } from '~/types/notification'

import { Icon, type IconName } from '../common/icon'
import { Pressable } from '../common/pressable'
import { Text } from '../common/text'
import { View } from '../common/view'

type Props = {
  notification: Notification
}

export function NotificationCard({ notification }: Props) {
  const t = useTranslations('component.notifications.card')
  const f = useFormatter()

  const { styles, theme } = useStyles(stylesheet)

  const { mark } = useMarkAsRead()

  const { handleLink } = useLink()

  const color = colors[notification.type]

  return (
    <Pressable
      align="center"
      direction="row"
      gap="4"
      onPress={() => {
        void handleLink(`https://www.reddit.com${notification.context}`)

        if (notification.new) {
          mark({
            id: notification.id,
          })
        }
      }}
      p="4"
      style={styles.main(color, notification.new)}
    >
      <Icon
        color={theme.colors[notification.new ? color : 'gray'].a9}
        name={icons[notification.type]}
        weight={notification.new ? 'fill' : 'bold'}
      />

      <View flexShrink={1} gap="2">
        <Text
          highContrast={notification.new}
          weight={notification.new ? 'medium' : undefined}
        >
          {t(notification.type, {
            subreddit: notification.subreddit,
            user: notification.author,
          })}
        </Text>

        <View direction="row" gap="4">
          <Text highContrast={false} size="2">
            {f.relativeTime(notification.createdAt)}
          </Text>

          <Text highContrast={false} size="2">
            {notification.subreddit}
          </Text>
        </View>
      </View>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: (color: ColorToken, unread: boolean) => ({
    backgroundColor:
      theme.colors[unread ? color : 'gray'][unread ? 'a3' : 'a1'],
  }),
}))

const icons: Record<NotificationType, IconName> = {
  comment_reply: 'ChatCircle',
  post_reply: 'ArrowBendUpLeft',
  username_mention: 'User',
}

const colors: Record<NotificationType, ColorToken> = {
  comment_reply: 'plum',
  post_reply: 'jade',
  username_mention: 'ruby',
}
