
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import rollupBanner from '@jswork/rollup-banner';

export default {
  input: 'src/index.ts',
  output: {
    name: 'PageUpdateChecker',
    banner: rollupBanner(),
    file: 'dist/index.umd.js',
    format: 'umd',
    dynamicImportInCjs: true,
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    typescript({ tsconfig: './tsconfig.json' }),
  ],
};
