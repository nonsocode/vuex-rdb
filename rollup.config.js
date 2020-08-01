import typescript from '@rollup/plugin-typescript';
const config = {
  input: 'src/index.ts',
  output: {
    file: 'dist/vuex-db.js',
    format: 'es',
    name: 'vuex-db',
    esModule: false
  },
  plugins: [typescript()]
};
export default config;
