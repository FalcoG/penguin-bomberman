import { OutlineFilter } from 'pixi-filters'
import { useContext } from 'react'
import { Sprite } from '@pixi/react'
import { TPoint } from '../../../../lib/types'
import AssetsContext from '../../AssetsContext'
import config from '../../../config.json'
import { positionToCoords } from '../../utils'

const Bomb = ({ x, y }: TPoint) => {
  const assets = useContext(AssetsContext)

  return (
    <Sprite
      texture={assets?.bomb}
      height={config.graphics.block_size_px * 0.75}
      width={config.graphics.block_size_px * 0.75}
      anchor={{ x: 0.5, y: 0.5 }}
      {...positionToCoords(x, y)}
      filters={[new OutlineFilter(3, 0xFF0000)]}
    />
  )
}

export default Bomb
