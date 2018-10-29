import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import {
  terser
} from "rollup-plugin-terser";
import filesize from 'rollup-plugin-filesize'
import builtins from 'rollup-plugin-node-builtins'

function commonConfig(outputDir, format) {
  return {
    input: './src/index.js',
    output: {
      file: `./${outputDir}/index.js`,
      format: format
    },
    plugins: [
      builtins(),
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
          indent_level: 2
        }
      }),
    ],
  }
}
export default [
  commonConfig('lib','cjs'),
  commonConfig('jsnext','esm')
]