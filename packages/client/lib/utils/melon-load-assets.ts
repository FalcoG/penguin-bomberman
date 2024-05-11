import { AssetsConfig, AssetsCache } from '~/types/mod.ts'

const melonLoadAssets = async (assets: AssetsConfig) => {
  const result = await Promise.all(
    Object.keys(assets).map(async (asset) => {
      const url = assets[asset]
      const extension = url.split('.').pop()

      if (extension !== 'svg') throw new Error('Unsupported file format')
      const result = await fetch(url)

      if (!result.ok) throw Error('Unable to fetch asset')
      // todo: check mime type

      return {
        asset,
        url,
        data: 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(await result.text())
      }
    })
  )

  const output: AssetsCache = {}

  result.forEach((item) => {
    output[item.asset] = { url: item.url, data: item.data }
  })

  return output
}

export default melonLoadAssets
