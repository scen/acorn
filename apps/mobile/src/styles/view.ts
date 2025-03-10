import { type FlexStyle } from 'react-native'
import {
  type UnistylesTheme,
  type UnistylesValues,
} from 'react-native-unistyles/lib/typescript/src/types'

import { type SpaceToken } from '~/styles/tokens'

import {
  getMargin,
  getPadding,
  type MarginProps,
  type PaddingProps,
} from './space'

export type ViewStyleProps = {
  align?: 'baseline' | 'center' | 'end' | 'start' | 'stretch'
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  flex?: number
  flexBasis?: number
  flexGrow?: number
  flexShrink?: number
  gap?: SpaceToken | number
  gapX?: SpaceToken | number
  gapY?: SpaceToken | number
  height?: SpaceToken | number
  justify?: 'between' | 'center' | 'end' | 'start'
  self?: 'center' | 'end' | 'start' | 'stretch'
  width?: SpaceToken | number
  wrap?: 'nowrap' | 'wrap-reverse' | 'wrap'
} & MarginProps &
  PaddingProps

export function getViewStyles(theme: UnistylesTheme) {
  return function styles({
    align,
    direction,
    flex,
    flexBasis,
    flexGrow,
    flexShrink,
    gap,
    gapX,
    gapY,
    height,
    justify,
    self,
    width,
    wrap,
    ...props
  }: ViewStyleProps) {
    const alignItems: FlexStyle['alignItems'] =
      align === 'baseline'
        ? 'baseline'
        : align === 'center'
          ? 'center'
          : align === 'end'
            ? 'flex-end'
            : align === 'start'
              ? 'flex-start'
              : align === 'stretch'
                ? 'stretch'
                : undefined

    const justifyContent: FlexStyle['justifyContent'] =
      justify === 'between'
        ? 'space-between'
        : justify === 'center'
          ? 'center'
          : justify === 'end'
            ? 'flex-end'
            : justify === 'start'
              ? 'flex-start'
              : undefined

    const alignSelf: FlexStyle['alignSelf'] =
      self === 'center'
        ? 'center'
        : self === 'stretch'
          ? 'stretch'
          : self === 'end'
            ? 'flex-end'
            : self === 'start'
              ? 'flex-start'
              : undefined

    return {
      ...getMargin(theme)(props),
      ...getPadding(theme)(props),
      alignItems,
      alignSelf,
      columnGap: getSpace(theme, gapY),
      flex,
      flexBasis,
      flexDirection: direction,
      flexGrow,
      flexShrink,
      flexWrap: wrap,
      gap: getSpace(theme, gap),
      height: getSpace(theme, height),
      justifyContent,
      rowGap: getSpace(theme, gapX),
      width: getSpace(theme, width),
    } satisfies UnistylesValues
  }
}

function getSpace(theme: UnistylesTheme, key?: SpaceToken | number) {
  if (!key) {
    return
  }

  if (typeof key === 'number') {
    return key
  }

  return theme.space[key]
}
