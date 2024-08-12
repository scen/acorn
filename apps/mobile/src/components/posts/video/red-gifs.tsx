import { useEffect } from 'react'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Spinner } from '~/components/common/spinner'
import { useCommon } from '~/hooks/common'
import { useRedGifs } from '~/hooks/redgifs'
import { getDimensions } from '~/lib/media'
import { type PostMedia } from '~/types/post'

import { VideoPlayer } from './player'

type Props = {
  margin?: number
  style?: StyleProp<ViewStyle>
  video: PostMedia
  viewing: boolean
}

export function RedGifsVideo({ margin = 0, style, video, viewing }: Props) {
  const common = useCommon()

  const { styles } = useStyles(stylesheet)

  const { data, get } = useRedGifs(video.url)

  useEffect(() => {
    if (data && data.expiresAt > new Date()) {
      return
    }

    get(video.url)
  }, [data, get, video.url])

  if (data) {
    return (
      <VideoPlayer
        margin={margin}
        source={data.source}
        style={style}
        video={video}
        viewing={viewing}
      />
    )
  }

  const frameWidth = common.frame.width - margin

  const dimensions = getDimensions(frameWidth, video)

  return (
    <View
      style={styles.main(
        common.height.max,
        dimensions.height,
        dimensions.width,
      )}
    >
      <Spinner />
    </View>
  )
}

const stylesheet = createStyleSheet(() => ({
  main: (maxHeight: number, height: number, width: number) => ({
    alignItems: 'center',
    height: Math.min(maxHeight, height),
    justifyContent: 'center',
    width,
  }),
}))
