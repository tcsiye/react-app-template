import { resolve } from 'path';
const devPath = 'http://xxx:80/'
export default {
  alias: {
    components: resolve(__dirname, './src/components'),
  },
  "proxy" : {
    "/api": {
      "target": devPath,
      "changeOrigin": false
    },
  }
};
