import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve';
import { argv } from 'yargs';

const format = argv.format || argv.f || 'iife';
const compress = argv.uglify;

const babelOptions = {
  exclude: 'node_modules/**',
  presets: [['@babel/preset-env', { modules: false }]],
  plugins: ["@babel/plugin-proposal-optional-chaining"],
  babelrc: false
};

const dest = {
  amd: `dist/amd/loc-i18next${compress ? '.min' : ''}.js`,
  umd: `dist/umd/loc-i18next${compress ? '.min' : ''}.js`,
  iife: `dist/iife/loc-i18next${compress ? '.min' : ''}.js`
}[format];

export default {
  entry: 'src/main.js',
  format,
  plugins: [
    babel(babelOptions),
    nodeResolve({ jsnext: true })
  ].concat(compress ? uglify() : []),
  moduleName: 'locI18next',
  dest
};

