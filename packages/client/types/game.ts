export type TypeCoordinateX = number
export type TypeCoordinateY = number

export type TPoint = { x: TypeCoordinateX; y: TypeCoordinateY }
export type TPointArray = [TypeCoordinateX, TypeCoordinateY]

export type TFrameNumber = number;
export type TFrameDelta = number;
export type TFrameTimestamp = number;

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
