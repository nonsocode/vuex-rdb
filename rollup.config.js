import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve'

const config = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/vuex-db.es.js',
      format: 'es',
      name: 'vuex-db',
      esModule: false
    },
    {
      file: 'dist/vuex-db.cjs.js',
      format: 'cjs',
      name: 'vuex-db',
      esModule: false
    },
  ],
  plugins: [typescript()]
};
export default config;
