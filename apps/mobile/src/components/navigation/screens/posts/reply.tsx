import { useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { TextInput } from 'react-native'
import Animated from 'react-native-reanimated'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'
import { z } from 'zod'

import { Pressable } from '~/components/common/pressable'
import { Spinner } from '~/components/common/spinner'
import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { useKeyboard } from '~/hooks/keyboard'
import { usePostReply } from '~/hooks/mutations/posts/reply'

const schema = z.object({
  commentId: z.string().optional(),
  id: z.string().catch('17jkixh'),
  user: z.string().optional(),
})

export function PostReplyScreen() {
  const router = useRouter()

  const params = schema.parse(useLocalSearchParams())

  const t = useTranslations('screen.posts.reply')

  const { styles, theme } = useStyles(stylesheet)

  const keyboard = useKeyboard()

  const { isPending, reply } = usePostReply()

  const [text, setText] = useState('')

  return (
    <Animated.ScrollView
      contentContainerStyle={styles.content}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      style={keyboard.styles}
    >
      <StatusBar style="light" />

      {params.user ? (
        <View p="4" style={styles.user}>
          <Text weight="medium">
            {t('user', {
              user: params.user,
            })}
          </Text>
        </View>
      ) : null}

      <TextInput
        multiline
        onChangeText={setText}
        placeholder={t('placeholder')}
        placeholderTextColor={theme.colors.gray.a9}
        selectionColor={theme.colors.accent.a9}
        style={styles.input}
        value={text}
      />

      <Pressable
        align="center"
        direction="row"
        disabled={isPending}
        justify="center"
        onPress={async () => {
          if (text.length === 0) {
            return
          }

          await reply({
            commentId: params.commentId,
            postId: params.id,
            text,
          })

          router.back()
        }}
        pt="3"
        style={styles.submit(keyboard.visible)}
      >
        {isPending ? (
          <Spinner contrast style={styles.spinner} />
        ) : (
          <Text contrast weight="medium">
            {t('submit')}
          </Text>
        )}
      </Pressable>
    </Animated.ScrollView>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  content: {
    flexGrow: 1,
  },
  input: {
    color: theme.colors.gray.a12,
    flexGrow: 1,
    fontFamily: 'sans-regular',
    fontSize: theme.typography[3].fontSize,
    padding: theme.space[3],
  },
  spinner: {
    height: theme.typography[3].lineHeight,
  },
  submit: (visible: boolean) => ({
    backgroundColor: theme.colors.accent.a9,
    paddingBottom: theme.space[3] + (visible ? 0 : runtime.insets.bottom),
  }),
  user: {
    backgroundColor: theme.colors.gray.a2,
  },
}))
