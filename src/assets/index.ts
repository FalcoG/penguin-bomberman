import { Assets } from 'pixi.js'

import BombAsset from './bomb.svg'
import StaticIceAsset from './static_ice.svg'

const assetsLoader = async () => {
  const optionsHiDPI = {
    resolution: window.devicePixelRatio,
    resourceOptions: {
      scale: window.devicePixelRatio
    }
  }

  // todo: parallelization + apply loadBundleBackground
  const bomb = await Assets.load(
    { src: BombAsset, data: optionsHiDPI }
  );
  const static_ice = await Assets.load(
    { src: StaticIceAsset, data: optionsHiDPI }
  );

  return { bomb, static_ice }
}

export default assetsLoader;
