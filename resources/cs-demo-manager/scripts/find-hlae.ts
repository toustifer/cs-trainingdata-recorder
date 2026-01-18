import { getHlaeExecutablePath } from '../src/node/video/hlae/hlae-location';
import './load-dot-env-variables.mjs';

(async () => {
  try {
    const path = await getHlaeExecutablePath();
    console.log(path);
  } catch (error) {
    console.error('ERROR');
  }
})();
