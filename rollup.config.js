import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve'
import {terser} from "rollup-plugin-terser";

const moduleConfig = {
  input: 'src/index.ts',
  external: ['normalizr', 'vuex'],
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
    }
  ],
  plugins: [typescript()]
};

const browserConfig = {
  input: 'src/index.ts',
  output: {
    file: 'dist/vuex-db.min.js',
    format: 'iife',
    name: 'VuexRdb'
  },
  plugins: [typescript(), resolve(), terser()]
}
export default [browserConfig, moduleConfig];
