import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import {
  terser
} from "rollup-plugin-terser";
import filesize from 'rollup-plugin-filesize'

export default {
  input: './src/index.js',
  output: {
    file: './lib/index.js',
    format: 'esm'
  },
  plugins: [
    babel({
      exclude: "node_modules/**",
      runtimeHelpers: true
    }),
    commonjs(),
    filesize(),
    terser({
      sourcemap: true,
      output: {
        comments: false,
        indent_level:2
      }
    }),
  ],
}