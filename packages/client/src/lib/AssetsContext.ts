import { createContext } from 'react'
import assetsLoader from '../assets'

const AssetsContext = createContext<Awaited<ReturnType<typeof assetsLoader>> | undefined>(undefined)

export default AssetsContext

