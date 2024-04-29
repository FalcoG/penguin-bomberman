export type TypeCoordinateX = number;
export type TypeCoordinateY = number;

export interface TypeCoordinates2D {
  object: { x: TypeCoordinateX; y: TypeCoordinateY }
  array: [number, number],
}

export type TPlayerMovement = {
  direction: 'left' | 'right' | 'up' | 'down',
  velocity: TypeCoordinates2D['object']
}

export interface TGameState { grid: Array<'immutable_ice' | false> }
