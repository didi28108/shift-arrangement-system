const path = require('path');
const webpack = require('webpack');
const moment = require('moment');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const __DEBUG__ = process.env.__DEBUG__ !== 'false';
const hash = moment().format('YYMMDDHHmm');

const extractCSS = new ExtractTextPlugin(`renderer/css/plugins.css?${hash}`);
const extractSCSS = new ExtractTextPlugin(`renderer/css/main.css?${hash}`);

let config = {
  entry: {
    app: path.resolve(__dirname, '../src/renderer/index.js'),
    vendors: [
      'vue', 'vue-router', 'bootstrap-vue', 'lodash'
    ]
  },
  output: {
    filename: `renderer/js/[name].js?${hash}`,
    path: path.resolve(__dirname, '../dist'),
  },
  devtool: __DEBUG__ ? 'source-map' : '',
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: [ require.resolve("bootstrap-vue") ],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['stage-0']
          }
        }
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            extractCSS: false,
            loaders: {
              scss: 'vue-style-loader!css-loader!sass-loader'
            }
          }
        }
      },
      {
        test: /\.scss$/,
        use: extractSCSS.extract({
          use: [ 'css-loader', 'sass-loader' ]
        })
      },
      {
        test: /\.css$/,
        use: extractCSS.extract({
          use: [ 'css-loader' ]
        })
      },
      {
        test: /\.(png|gif|jpg|svg|ttf|woff|woff2|otf|eot)$/,
        use: {
          loader: 'file-loader',
          options: { outputPath: 'renderer/assets/', publicPath: '../../' }
        }
      },
    ]
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
      '@': path.resolve(__dirname, '../src/renderer'),
    },
    extensions: ['.js', '.vue', '.json', '.scss']
  },
  plugins: [
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        Popper: 'popper.js',
        Tether: 'tether',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendors'],
      filename: 'renderer/js/[name].js'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: path.resolve(__dirname, '../src/index.html'),
    }),
    extractCSS,
    extractSCSS,
  ]
};

module.exports = config;
