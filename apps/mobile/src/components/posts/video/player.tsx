import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import { useVideoPlayer, type VideoSource, VideoView } from 'expo-video'
import { useEffect, useState } from 'react'
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslations } from 'use-intl'

import { Text } from '~/components/common/text'
import { View } from '~/components/common/view'
import { usePreferences } from '~/stores/preferences'
import { type PostMedia } from '~/types/post'

import { Icon } from '../../common/icon'
import { Pressable } from '../../common/pressable'
import { VideoModal } from './modal'

type Props = {
  compact?: boolean
  crossPost?: boolean
  nsfw?: boolean
  source: VideoSource
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function VideoPlayer({
  compact,
  crossPost,
  nsfw,
  source,
  style,
  video,
  viewing,
}: Props) {
  const t = useTranslations('component.posts.video')

  const { blurNsfw, feedMuted, unmuteFullscreen } = usePreferences()

  const { styles, theme } = useStyles(stylesheet)

  const [visible, setVisible] = useState(false)
  const [muted, setMuted] = useState(feedMuted)

  const player = useVideoPlayer(source, (instance) => {
    instance.muted = true
    instance.loop = true

    if (viewing) {
      instance.play()
    }
  })

  useEffect(() => {
    player.muted = muted

    if (visible || viewing) {
      player.play()
    } else {
      player.pause()
    }
  }, [blurNsfw, muted, nsfw, player, viewing, visible])

  return (
    <>
      {compact ? (
        <Pressable
          onPress={() => {
            setMuted(!unmuteFullscreen)
            setVisible(true)
          }}
          style={styles.compact}
        >
          <Image source={video.thumbnail} style={styles.compactImage} />

          <View align="center" justify="center" style={styles.play}>
            <Icon color={theme.colors.accent.a9} name="Play" weight="fill" />
          </View>

          {nsfw && blurNsfw ? (
            <BlurView
              intensity={100}
              pointerEvents="none"
              style={styles.blur}
            />
          ) : null}
        </Pressable>
      ) : (
        <Pressable
          onPress={() => {
            setMuted(!unmuteFullscreen)
            setVisible(true)
          }}
          style={[styles.main(crossPost), style]}
        >
          <VideoView
            allowsFullscreen={false}
            allowsPictureInPicture={false}
            allowsVideoFrameAnalysis={false}
            contentFit="cover"
            nativeControls={false}
            player={player}
            style={styles.video(video.width / video.height)}
          />

          {nsfw && blurNsfw ? (
            <BlurView intensity={100} pointerEvents="none" style={styles.blur}>
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
              hitSlop={theme.space[2]}
              onPress={() => {
                setMuted(() => !muted)
              }}
              p="2"
              style={styles.volume}
            >
              <Icon
                color={theme.colors.gray.contrast}
                name={muted ? 'SpeakerSimpleX' : 'SpeakerSimpleHigh'}
                size={theme.space[4]}
              />
            </Pressable>
          )}
        </Pressable>
      )}

      <VideoModal
        muted={muted}
        onClose={() => {
          setMuted(feedMuted)
          setVisible(false)
        }}
        onMutedChange={setMuted}
        player={player}
        video={video}
        visible={visible}
      />
    </>
  )
}

const stylesheet = createStyleSheet((theme, runtime) => ({
  blur: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    gap: theme.space[4],
    justifyContent: 'center',
  },
  compact: {
    backgroundColor: theme.colors.gray.a3,
    borderCurve: 'continuous',
    borderRadius: theme.space[1],
    height: theme.space[8],
    overflow: 'hidden',
    width: theme.space[8],
  },
  compactImage: {
    flex: 1,
  },
  main: (crossPost?: boolean) => ({
    justifyContent: 'center',
    maxHeight: runtime.screen.height * (crossPost ? 0.3 : 0.5),
    overflow: 'hidden',
  }),
  play: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black.a6,
    height: theme.space[8],
    width: theme.space[8],
  },
  video: (aspectRatio: number) => ({
    aspectRatio,
  }),
  volume: {
    backgroundColor: theme.colors.black.a9,
    borderCurve: 'continuous',
    borderRadius: theme.space[4],
    bottom: theme.space[2],
    position: 'absolute',
    right: theme.space[2],
  },
}))
