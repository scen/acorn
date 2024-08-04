import { type ReactNode, useEffect } from 'react'
import { Modal, StyleSheet } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

type Props = {
  children: ReactNode
  onClose: () => void
  visible: boolean
}

export function FakeModal({ children, onClose, visible }: Props) {
  const frame = useSafeAreaFrame()

  const { styles } = useStyles(stylesheet)

  const translate = useSharedValue(frame.height)

  useEffect(() => {
    if (visible) {
      translate.value = withTiming(0, {
        duration: 250,
      })
    }
  }, [translate, visible])

  const threshold = frame.height * 0.2

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translate.value = event.translationY > 0 ? event.translationY : 0
    })
    .onEnd((event) => {
      if (event.translationY > threshold) {
        translate.value = withTiming(
          frame.height,
          {
            duration: 250,
          },
          () => {
            runOnJS(onClose)()
          },
        )
      } else {
        translate.value = withTiming(0, {
          duration: 250,
        })
      }
    })

  const overlayStyle = useAnimatedStyle(
    () => ({
      opacity: interpolate(translate.value, [0, frame.height], [1, 0]),
    }),
    [translate.value],
  )

  const contentStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: translate.value,
      },
    ],
  }))

  return (
    <Modal transparent visible={visible}>
      <Animated.View
        pointerEvents="none"
        style={[styles.overlay, overlayStyle]}
      />

      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.main, contentStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </Modal>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  header: (inset: number) => ({
    position: 'absolute',
    right: 0,
    top: inset,
  }),
  main: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.gray[1],
  },
}))
