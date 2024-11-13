import { type StyleProp, type ViewStyle } from 'react-native'

import { parse } from '~/lib/markdown'
import { type TypographyToken } from '~/styles/tokens'
import { type PostMediaMeta } from '~/types/post'

import { View } from '../view'
import { Node } from './markdown'

export type MarkdownVariant = 'comment' | 'post'

type Props = {
  children: string
  meta?: PostMediaMeta
  recyclingKey: string
  size?: TypographyToken
  style?: StyleProp<ViewStyle>
  variant: MarkdownVariant
}

export function Markdown({
  children,
  meta,
  recyclingKey,
  size = '3',
  style,
  variant,
}: Props) {
  const markdown = parse(children)

  return (
    <View gap="3" style={style}>
      {markdown.children.map((node, index) => (
        <Node
          // eslint-disable-next-line react/no-array-index-key -- go away
          key={index}
          meta={meta}
          node={node}
          recyclingKey={recyclingKey}
          size={size}
          variant={variant}
        />
      ))}
    </View>
  )
}
