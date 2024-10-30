import { decode } from 'entities'

import { dateFromUnix } from '~/lib/intl'
import { removePrefix } from '~/lib/reddit'
import { type CommunityDataSchema } from '~/schemas/communities'
import { type Community } from '~/types/community'

export function transformCommunity(data: CommunityDataSchema): Community {
  const user = data.display_name.startsWith('u_')

  return {
    createdAt: dateFromUnix(data.created_utc ?? 0),
    favorite: Boolean(data.user_has_favorited),
    id: removePrefix(data.name),
    image: data.community_icon
      ? decode(data.community_icon) || undefined
      : data.icon_img
        ? decode(data.icon_img) || undefined
        : undefined,
    name: user ? `u/${data.display_name.slice(2)}` : data.display_name,
    subscribed: Boolean(data.user_is_subscriber),
    subscribers: data.subscribers ?? 0,
    user,
  }
}
