import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import json from "rollup-plugin-json";
import {
  uglify
} from "rollup-plugin-uglify";
import filesize from 'rollup-plugin-filesize'

export default {
  input: './src/index.js',
  output: {
    file: './lib/index.js',
    format: 'cjs'
  },
  plugins: [
    // json(),
    resolve(),
    babel({
      exclude: "node_modules/**",
      runtimeHelpers: true
    }),
    commonjs(),
    // uglify(),
    filesize(),
  ],
};