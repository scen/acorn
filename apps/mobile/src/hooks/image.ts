import { createId } from '@paralleldrive/cuid2'
import { useMutation } from '@tanstack/react-query'
import * as Clipboard from 'expo-clipboard'
import { Directory, File, Paths } from 'expo-file-system/next'
import { type ImageProps } from 'expo-image'
import * as MediaLibrary from 'expo-media-library'
import { useRef } from 'react'
import { useStyles } from 'react-native-unistyles'

import placeholderDark from '~/assets/images/placeholder-dark.png'
import placeholderLight from '~/assets/images/placeholder-light.png'
import { usePreferences } from '~/stores/preferences'

export function useImagePlaceholder() {
  const { theme } = useStyles()

  return {
    placeholder: theme.name === 'dark' ? placeholderDark : placeholderLight,
    placeholderContentFit: 'contain',
  } satisfies ImageProps
}

type DownloadVariables = {
  url: string
}

export function useDownloadImage() {
  const { saveToAlbum } = usePreferences()

  const timer = useRef<NodeJS.Timeout>()

  const { isError, isPending, isSuccess, mutate, reset } = useMutation<
    unknown,
    Error,
    DownloadVariables
  >({
    async mutationFn(variables) {
      const { granted } =
        await MediaLibrary.requestPermissionsAsync(!saveToAlbum)

      if (!granted) {
        throw new Error('Permission not granted')
      }

      const directory = new Directory(Paths.cache, createId())

      directory.create()

      const file = await File.downloadFileAsync(variables.url, directory)

      if (saveToAlbum) {
        const album = await getAlbum()

        const asset = await MediaLibrary.createAssetAsync(file.uri)

        await MediaLibrary.addAssetsToAlbumAsync([asset], album)

        return
      }

      await MediaLibrary.saveToLibraryAsync(file.uri)

      directory.delete()
    },
    onSettled() {
      if (timer.current) {
        clearTimeout(timer.current)
      }

      timer.current = setTimeout(() => {
        reset()
      }, 5_000)
    },
  })

  return {
    download: mutate,
    isError,
    isPending,
    isSuccess,
  }
}

type CopyVariables = {
  url: string
}

export function useCopyImage() {
  const timer = useRef<NodeJS.Timeout>()

  const { isError, isPending, isSuccess, mutate, reset } = useMutation<
    unknown,
    Error,
    CopyVariables
  >({
    async mutationFn(variables) {
      const directory = new Directory(Paths.cache, createId())

      directory.create()

      const file = await File.downloadFileAsync(variables.url, directory)

      await Clipboard.setImageAsync(file.base64())

      directory.delete()
    },
    onSettled() {
      if (timer.current) {
        clearTimeout(timer.current)
      }

      timer.current = setTimeout(() => {
        reset()
      }, 5_000)
    },
  })

  return {
    copy: mutate,
    isError,
    isPending,
    isSuccess,
  }
}

async function getAlbum() {
  const name = 'Acorn'

  const exists = (await MediaLibrary.getAlbumAsync(
    name,
  )) as MediaLibrary.Album | null

  if (exists) {
    return exists
  }

  return MediaLibrary.createAlbumAsync(name)
}
