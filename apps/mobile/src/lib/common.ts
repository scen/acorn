import { Platform } from 'react-native'

export const cardMaxWidth = 700

export const iPhone = Platform.OS === 'ios' && !Platform.isPad
export const iPad = Platform.OS === 'ios' && Platform.isPad

export const swipeActionThreshold = {
  long: iPad ? 0.2 : 0.4,
  short: iPad ? 0.1 : 0.2,
} as const
