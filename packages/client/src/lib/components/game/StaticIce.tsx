import { TPoint } from '../../../../lib/types'
import { useContext } from 'react'
import AssetsContext from '../../AssetsContext'
import { Sprite } from '@pixi/react'
import config from '../../../config.json'
import { positionToCoords } from '../../utils'

const StaticIce = ({ x, y }: TPoint) => {
  const assets = useContext(AssetsContext)

  return (
    <Sprite
      texture={assets?.static_ice}
      height={config.graphics.block_size_px}
      width={config.graphics.block_size_px}
      anchor={{ x: 0.5, y: 0.5 }}
      {...positionToCoords(x, y)}
    />
  )
}

export default StaticIce
