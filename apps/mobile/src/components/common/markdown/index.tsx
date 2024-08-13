/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison -- go away */

import MarkdownToJsx from 'markdown-to-jsx'
import { type PropsWithChildren } from 'react'
import { type StyleProp, type ViewStyle } from 'react-native'

import { useCommon } from '~/hooks/common'
import { type TypographyToken } from '~/styles/tokens'
import { type PostMediaMeta } from '~/types/post'

import { Text } from '../text'
import {
  BlockQuote,
  Code,
  CodeBlock,
  fixMarkdown,
  HorizontalRule,
  Image,
  LineBreak,
  Link,
  List,
  Spoiler,
  StrikeThrough,
  Table,
  TableBody,
  TableHeader,
  TableRow,
  Wrapper,
} from './components'

type Props = {
  children: string
  margin?: number
  meta?: PostMediaMeta
  size?: TypographyToken
  style?: StyleProp<ViewStyle>
}

export function Markdown({ children, margin = 0, meta, size, style }: Props) {
  const common = useCommon()

  const frameWidth = common.frame.width - margin

  const props = {
    size,
  }

  return (
    <MarkdownToJsx
      options={{
        disableParsingRawHTML: true,
        forceBlock: true,
        forceWrapper: true,
        overrides: {
          Spoiler: {
            component: Spoiler,
          },
          a: {
            component: Link,
            props: {
              frameWidth,
              meta,
              size,
            },
          },
          blockquote: {
            component: BlockQuote,
            props,
          },
          br: {
            component: LineBreak,
          },
          code: {
            component: Code,
            props,
          },
          del: {
            component: StrikeThrough,
            props,
          },
          em: {
            component: Text,
            props,
          },
          h1: {
            component: Text,
            props: {
              size: '6',
              weight: 'bold',
            },
          },
          h2: {
            component: Text,
            props: {
              size: '5',
              weight: 'bold',
            },
          },
          h3: {
            component: Text,
            props: {
              size: '5',
              weight: 'bold',
            },
          },
          h4: {
            component: Text,
            props: {
              size: '4',
              weight: 'bold',
            },
          },
          h5: {
            component: Text,
            props: {
              size: '4',
              weight: 'bold',
            },
          },
          h6: {
            component: Text,
            props: {
              size: '4',
              weight: 'bold',
            },
          },
          hr: {
            component: HorizontalRule,
          },
          image: {
            component: Image,
            props: {
              margin,
            },
          },
          img: {
            component: Image,
            props: {
              margin,
            },
          },
          li: {
            component: Text,
            props: {
              ...props,
              style: {
                flex: 1,
              },
            },
          },
          ol: {
            component: List,
            props,
          },
          p: {
            component: Text,
            props,
          },
          pre: {
            component: CodeBlock,
          },
          span: {
            component: Text,
            props,
          },
          strong: {
            component: Text,
            props: {
              size,
              weight: 'bold',
            },
          },
          sub: {
            component: Text,
            props: {
              size: '1',
              weight: 'light',
            },
          },
          sup: {
            component: Text,
            props: {
              size: '1',
              weight: 'light',
            },
          },
          table: {
            component: Table,
          },
          tbody: {
            component: TableBody,
          },
          td: {
            component: Text,
            props,
          },
          text: {
            component: Text,
            props,
          },
          th: {
            component: Text,
            props: {
              size,
              weight: 'bold',
            },
          },
          thead: {
            component: TableHeader,
          },
          tr: {
            component: TableRow,
          },
          ul: {
            component: List,
            props,
          },
        },
        renderRule(next, node, renderChildren, state) {
          if (
            node.type === '27' &&
            node.text.startsWith('^(') &&
            node.text.endsWith(')')
          ) {
            return (
              <Text key={state.key} size="1" weight="light">
                {node.text.slice(2, -1)}
              </Text>
            )
          }

          return next()
        },
        wrapper: (wrapper: PropsWithChildren) => (
          <Wrapper {...wrapper} style={style} />
        ),
      }}
    >
      {fixMarkdown(children)}
    </MarkdownToJsx>
  )
}
