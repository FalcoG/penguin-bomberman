export type TypeCoordinateX = number
export type TypeCoordinateY = number

export type TPoint = { x: TypeCoordinateX; y: TypeCoordinateY }
export type TPointArray = [TypeCoordinateX, TypeCoordinateY]

export type AssetURL = string
export type AssetsConfig = {
  [key: string]: AssetURL
}

export type AssetsCache = {
  [key: string]: {
    url: AssetURL
    data: string
  }
}
