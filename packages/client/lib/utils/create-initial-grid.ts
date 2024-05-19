import { TGameState } from '~/types/context.ts'
import config from '~/lib/config.ts'

const createInitialGrid = (): TGameState['grid'] => {
  const newGridLayout: TGameState['grid'] = []

  for (let ix = 0; config.grid.size.width > ix; ix++) {
    const rows = config.grid.ice_immutable_pattern.length

    for (let iy = 0; config.grid.size.height > iy; iy++) {
      const row = config.grid.ice_immutable_pattern[iy % rows]
      const cell = row[ix % row.length]


      const index = ix + config.grid.size.width * iy
      newGridLayout[index] = cell ? 'immutable_ice' : false
    }
  }

  return newGridLayout
}

export default createInitialGrid
