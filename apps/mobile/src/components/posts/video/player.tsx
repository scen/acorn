import { BlurView } from 'expo-blur'
import { useVideoPlayer, type VideoSource, VideoView } from 'expo-video'
import { useEffect, useState } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Text } from '~/components/common/text'
import { useCommon } from '~/hooks/common'
import { getDimensions } from '~/lib/media'
import { usePreferences } from '~/stores/preferences'
import { type Post, type PostMedia } from '~/types/post'

import { FakeModal } from '../../common/fake-modal'
import { Icon } from '../../common/icon'
import { Pressable } from '../../common/pressable'

type Props = {
  margin?: number
  post: Post
  source: VideoSource
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function VideoPlayer({
  margin = 0,
  post,
  source,
  style,
  video,
  viewing,
}: Props) {
  const t = useTranslations('component.posts.video')

  const common = useCommon()

  const { muted, nsfw, updatePreferences } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const [visible, setVisible] = useState(false)

  const frameWidth = common.frame.width - margin

  const player = useVideoPlayer(source, (instance) => {
    instance.muted = true
    instance.loop = true

    if (viewing) {
      instance.play()
    }
  })

  useEffect(() => {
    player.muted = visible ? muted : !viewing || muted

    if (visible || (viewing && (nsfw ? true : !post.nsfw))) {
      player.play()
    } else {
      player.pause()
    }
  }, [muted, nsfw, player, post.nsfw, viewing, visible])

  useEffect(() => {
    const volumeChange = player.addListener('volumeChange', (volume) => {
      updatePreferences({
        muted: volume.isMuted,
      })
    })

    return () => {
      volumeChange.remove()
    }
  }, [player, updatePreferences])

  const dimensions = getDimensions(frameWidth, video)

  return (
    <>
      <Pressable
        onPress={() => {
          setVisible(true)
        }}
        style={style}
        without
      >
        <VideoView
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          allowsVideoFrameAnalysis={false}
          contentFit="cover"
          nativeControls={false}
          player={player}
          style={styles.main(
            common.height.max,
            dimensions.height,
            dimensions.width,
          )}
        />

        {post.nsfw && !nsfw ? (
          <BlurView
            intensity={100}
            pointerEvents="none"
            style={[
              styles.main(
                common.height.max,
                dimensions.height,
                dimensions.width,
              ),
              styles.blur,
            ]}
          >
            <Icon
              color={theme.colors.gray.a12}
              name="Warning"
              size={theme.space[6]}
              weight="fill"
            />

            <Text weight="medium">{t('nsfw')}</Text>
          </BlurView>
        ) : (
          <Pressable
            hitSlop={theme.space[3]}
            onPress={() => {
              updatePreferences({
                muted: !muted,
              })
            }}
            style={styles.volume}
          >
            <Icon
              color={theme.colors.white.a11}
              name={muted ? 'SpeakerSimpleX' : 'SpeakerSimpleHigh'}
              size={theme.space[4]}
            />
          </Pressable>
        )}
      </Pressable>

      <FakeModal
        onClose={() => {
          setVisible(false)
        }}
        style={styles.modal}
        visible={visible}
      >
        <VideoView
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          allowsVideoFrameAnalysis={false}
          contentFit="contain"
          nativeControls
          player={player}
          style={styles.video(
            common.frame.height,
            dimensions.height,
            dimensions.width,
          )}
        />
      </FakeModal>
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  blur: {
    alignItems: 'center',
    gap: theme.space[4],
    justifyContent: 'center',
    position: 'absolute',
  },
  main: (maxHeight: number, height: number, width: number) => ({
    height: Math.min(maxHeight, height),
    width,
  }),
  modal: {
    justifyContent: 'center',
  },
  video: (maxHeight: number, height: number, width: number) => ({
    height,
    maxHeight,
    width,
  }),
  volume: {
    backgroundColor: theme.colors.black.a9,
    borderRadius: theme.space[4],
    bottom: theme.space[3],
    padding: theme.space[2],
    position: 'absolute',
    right: theme.space[3],
  },
}))
