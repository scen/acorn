import {
  type InfiniteData,
  useInfiniteQuery,
  useIsRestoring,
} from '@tanstack/react-query'
import fuzzysort from 'fuzzysort'
import { uniqBy } from 'lodash'
import { create, type Draft } from 'mutative'
import { useMemo } from 'react'

import { getHidden } from '~/lib/db/hidden'
import { getHistory } from '~/lib/db/history'
import { queryClient } from '~/lib/query'
import { removePrefix } from '~/lib/reddit'
import { reddit } from '~/reddit/api'
import { REDDIT_URI } from '~/reddit/config'
import { PostsSchema, SavedPostsSchema } from '~/schemas/posts'
import { useAuth } from '~/stores/auth'
import { usePreferences } from '~/stores/preferences'
import { transformComment } from '~/transformers/comment'
import { transformPost } from '~/transformers/post'
import { type Comment } from '~/types/comment'
import { type Post } from '~/types/post'
import { type PostSort, type TopInterval } from '~/types/sort'
import { type UserFeedType } from '~/types/user'

import { type UserPostsQueryData } from '../user/posts'

type Param = string | undefined | null

type Page = {
  cursor: Param
  posts: Array<Post | Comment>
}

export type PostsQueryKey = [
  'posts',
  {
    accountId?: string
    community?: string
    feed?: string
    interval?: TopInterval
    sort?: PostSort
    user?: string
    userType?: UserFeedType
  },
]

export type PostsQueryData = InfiniteData<Page, Param>

export type PostsProps = {
  community?: string
  feed?: string
  interval?: TopInterval
  query?: string
  sort: PostSort
  user?: string
  userType?: UserFeedType
}

export function usePosts({
  community,
  feed,
  interval,
  query,
  sort,
  user,
  userType,
}: PostsProps) {
  const isRestoring = useIsRestoring()

  const { accountId } = useAuth()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery<Page, Error, PostsQueryData, PostsQueryKey, Param>({
    enabled: Boolean(accountId),
    initialPageParam: null,
    async queryFn({ pageParam }) {
      if (!accountId) {
        throw new Error('accountId not found')
      }

      const path = user
        ? `/user/${user}/${userType ?? 'submitted'}`
        : feed
          ? `/user/${accountId}/m/${feed}/${sort}`
          : community
            ? `/r/${community}/${sort}`
            : `/${sort}`

      const url = new URL(path, REDDIT_URI)

      url.searchParams.set('limit', '100')
      url.searchParams.set('sr_detail', 'true')

      if (userType !== 'saved') {
        url.searchParams.set('type', 'links')
      }

      if (sort === 'top' && interval) {
        url.searchParams.set('t', interval)
      }

      if (pageParam) {
        url.searchParams.set('after', pageParam)
      }

      const payload = await reddit({
        url,
      })

      const schema = userType === 'saved' ? SavedPostsSchema : PostsSchema

      const response = schema.parse(payload)

      return {
        cursor: response.data.after,
        posts: await filterPosts(response),
      }
    },
    // eslint-disable-next-line sort-keys-fix/sort-keys-fix -- go away
    getNextPageParam(page) {
      return page.cursor
    },
    queryKey: [
      'posts',
      {
        accountId,
        community,
        feed,
        interval,
        sort,
        user,
        userType,
      },
    ],
  })

  const posts = useMemo(() => {
    const items = uniqBy(data?.pages.flatMap((page) => page.posts) ?? [], 'id')

    if (query?.length) {
      const results = fuzzysort.go(query, items, {
        keys: ['title', 'data.body'],
      })

      return results.map((result) => result.obj)
    }

    return items
  }, [data?.pages, query])

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isRestoring || isLoading,
    posts,
    refetch,
  }
}

export async function filterPosts(
  data: PostsSchema | SavedPostsSchema,
): Promise<Array<Post | Comment>> {
  const { hideSeen } = usePreferences.getState()

  const posts = data.data.children
    .filter((post) => post.kind === 't3')
    .map((post) => post.data.id)

  const seen = await getHistory(posts)
  const hidden = await getHidden()

  return data.data.children
    .filter((item) => {
      if (item.kind === 't1') {
        return true
      }

      if (hideSeen && seen.includes(item.data.id)) {
        return false
      }

      if (
        item.data.subreddit_id &&
        hidden.communities.includes(removePrefix(item.data.subreddit_id))
      ) {
        return false
      }

      if (hidden.users.includes(removePrefix(item.data.author_fullname))) {
        return false
      }

      return true
    })
    .map((item) => {
      if (item.kind === 't1') {
        return transformComment(item)
      }

      return transformPost(item.data, seen)
    })
}

export function updatePosts(
  id: string,
  updater?: (draft: Draft<Post | Comment>) => void,
  remove?: boolean,
) {
  const cache = queryClient.getQueryCache()

  const queries = cache.findAll({
    queryKey: ['posts', {}] satisfies PostsQueryKey,
  })

  for (const query of queries) {
    queryClient.setQueryData<PostsQueryData | UserPostsQueryData>(
      query.queryKey,
      (previous) => {
        if (!previous) {
          return previous
        }

        return create(previous, (draft) => {
          let found = false

          for (const page of draft.pages) {
            if (found) {
              break
            }

            for (const item of page.posts) {
              if ('id' in item ? item.id === id : item.data.id === id) {
                updater?.(item)

                if (remove) {
                  const index = page.posts.findIndex(
                    (post) => ('id' in post ? post.id : post.data.id) === id,
                  )

                  page.posts.splice(index, 1)
                }

                found = true

                break
              }
            }
          }
        })
      },
    )
  }
}
