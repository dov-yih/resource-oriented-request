import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import {
  terser
} from "rollup-plugin-terser";
import filesize from 'rollup-plugin-filesize'

function commonConfig(outputDir, format) {
  return {
    input: './src/index.js',
    output: {
      file: `./${outputDir}/index.js`,
      format: format
    },
    plugins: [
      babel({
        babelrc: false,
        presets: [
          ["@babel/env", {
            "modules": false
          }],
        ],
         plugins: [
          [
            "@babel/plugin-transform-runtime",
            {
              "corejs": false,
              "helpers": false,
              "regenerator": true,
              "useESModules": true
            }
          ],
          ["@babel/plugin-proposal-decorators", {
            "legacy": true
          }],
          ["@babel/plugin-proposal-class-properties", {
            "loose": true
          }]
        ],
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
  commonConfig('lib', 'cjs'),
  commonConfig('jsnext', 'esm')
]