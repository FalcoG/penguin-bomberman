export type TypeCoordinateX = number;
export type TypeCoordinateY = number;

export interface TypeCoordinates2D {
  object: { x: TypeCoordinateX; y: TypeCoordinateY }
  array: [number, number],
}

export interface TGameState { grid: Array<'immutable_ice' | false> }
