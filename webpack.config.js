const path = require('path');
const webpack = require('webpack');

const base = __dirname

const PROD = process.env.NODE_ENV === 'production'

module.exports = {
  devtool: PROD ? false : 'cheap-module-source-map',
  entry: PROD ? path.join(base, 'src') : [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    path.join(base, 'src'),
  ],
  output: {
    path: path.join(base, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }
    })
  ],
  resolve: {
    alias: {
      // treed: path.join(base, 'treed'),
      // formative: path.join(base, 'formative'),
    },
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: [
        path.join(base, 'src'),
        // path.join(base, 'treed'),
        // path.join(base, 'formative'),
      ],
    }, /*{
      test: /\.less$/,
      loader: 'style-loader!css-loader!less-loader',
      include: [path.join(base, 'src')],
    }*/]
  }
};
