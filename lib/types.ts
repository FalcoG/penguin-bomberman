export type TypeCoordinateX = number
export type TypeCoordinateY = number

export type TPoint = { x: TypeCoordinateX; y: TypeCoordinateY }
export type TPointArray = [TypeCoordinateX, TypeCoordinateY]

export interface TGameState { grid: Array<'immutable_ice' | false> }
