import { useRouter } from 'expo-router'
import { Share } from 'react-native'
import { SheetManager } from 'react-native-actions-sheet'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Pressable } from '~/components/common/pressable'
import { View } from '~/components/common/view'
import { iPad } from '~/lib/common'
import { removePrefix } from '~/lib/reddit'
import { type Post } from '~/types/post'

import { FooterButton } from './button'
import { PostCommunity } from './community'
import { PostMeta } from './meta'

export type PostLabel = 'user' | 'subreddit'

type Props = {
  expanded?: boolean
  label?: PostLabel
  post: Post
  seen?: boolean
}

export function PostFooter({ expanded, label, post, seen }: Props) {
  const router = useRouter()

  const { styles, theme } = useStyles(stylesheet)

  return (
    <Pressable
      align="center"
      direction="row"
      disabled={expanded}
      gap="4"
      justify="between"
      onPress={() => {
        router.navigate({
          params: {
            id: removePrefix(post.id),
          },
          pathname: '/posts/[id]',
        })
      }}
      p="3"
    >
      <View align="start" flexShrink={1} gap="1">
        <PostCommunity label={label} post={post} seen={seen} />

        <PostMeta post={post} seen={seen} />
      </View>

      <View align="center" direction="row" gap="4">
        <FooterButton
          color={theme.colors.gray[seen ? 'a11' : 'a12']}
          icon="DotsThree"
          onPress={() => {
            void SheetManager.show('post-menu', {
              payload: {
                post,
              },
            })
          }}
          weight="bold"
        />

        <FooterButton
          color={theme.colors.gray[seen ? 'a11' : 'a12']}
          icon="Share"
          onPress={() => {
            const url = new URL(post.permalink, 'https://reddit.com')

            void Share.share({
              message: `${post.title} ${url.toString()}`,
            })
          }}
        />
      </View>

      {post.saved ? <View pointerEvents="none" style={styles.saved} /> : null}
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  saved: {
    backgroundColor: theme.colors.green[9],
    bottom: -theme.space[iPad ? 5 : 4],
    height: theme.space[iPad ? 8 : 6],
    position: 'absolute',
    right: -theme.space[iPad ? 5 : 4],
    transform: [
      {
        rotate: '45deg',
      },
    ],
    width: theme.space[iPad ? 8 : 6],
  },
}))
