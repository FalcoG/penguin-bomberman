import React from 'react'
import { TPoint } from '~/types/game.ts'

export type TSpriteProps = TPoint & {
  rot?: number,
  imagePath?: string
  size?: number
  sizeX?: number
  sizeY?: number
  offset?: [number, number]
}

const Sprite: React.FunctionComponent<TSpriteProps> = ({
  x,
  y,
  size = 1,
  sizeX ,
  sizeY,
  rot = 0,
  imagePath = '/assets/game/missing_texture_block.svg',
  offset = [0.5, 0.5]
}) => {
  const width = sizeX || size
  const height = sizeY || size
  const cssStyle: React.CSSProperties = {
    width: `${width}em`,
    height: `${height}em`,
    backgroundSize: 'cover',
    backgroundImage: `url('${imagePath}')`,
    position: 'absolute',
    top: `${y}em`,
    left: `${x}em`,
    transform: `rotate(${rot}deg) translate(${-offset[0]*100}%, ${-offset[1]*100}%)`,
    transformOrigin: '0% 0%'
  }

  return <span style={cssStyle}/>
}

export default Sprite
