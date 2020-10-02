import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
const commonConfig = {
  input: 'src/index.ts',
  external: ['hash-sum', 'vuex', 'vue'],
  output: {
    file: 'dist/vuex-rdb.js',
    format: 'cjs',
    esModule: false
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
  ]
};

const esConfig = {
  input: 'src/index.ts',
  external: ['hash-sum', 'vuex', 'vue'],
  output: {
    file: 'dist/vuex-rdb.es.js',
    format: 'es',
    esModule: true,
  },

  plugins: [typescript(), resolve()]
};

const browserConfig = {
  input: 'src/index.ts',
  external: ['vue', 'vuex'],
  output: {
    file: 'dist/vuex-rdb.min.js',
    format: 'iife',
    name: 'VuexRdb'
  },
  plugins: [resolve(), terser(), typescript()]
};
export default [esConfig, browserConfig, commonConfig];
