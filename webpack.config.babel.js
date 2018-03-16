import path from 'path';
import autoprefixer from 'autoprefixer';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const appName = 'bundle';
const entry = [
  'webpack-hot-middleware/client?reload=truepath=//localhost:4200/__webpack_hmr',
  './client/src/index.js'
];
const nodeEnv = process.env.NODE_ENV;
const webpackEnv = process.env.WEBPACK_ENV;
const outputPath = path.resolve(__dirname, 'client/assets');

const config = {
  entry,
  externals: {
    'react/addons': 'react',
    'react/lib/ExecutionEnvironment': 'react',
    'react/lib/ReactContext': 'react'
  },
  output: {
    path: outputPath,
    filename: appName,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /(\.js$)/,
        exclude: path.resolve(__dirname, 'node_modules'),
        include: path.resolve(__dirname, 'client'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env']
            }
          }
        ]
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: { importLoaders: 1 }
            },
            {
              loader: 'postcss-loader',
              options: { plugins: [autoprefixer()] }
            }
          ]
        })
      }, {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }, {
        test: /\.(gif|jpe?g|png|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'client/assets/images/[name].[ext]'
          }
        }
      }, {
        test: /\.(eot|ttf|woff2?)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'client/assets/fonts/[name].[ext]'
          }
        }
      }, {
        test: /\.(aac|flac|mkv|mp3|mp4|ogg|wma|wmv)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'client/assets/media/[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'Document Manager',
      template: 'client/assets/template.html'
    }),
    new ExtractTextPlugin({
      filename: 'client/assets/style.css',
    })
  ]
};

if (webpackEnv === 'production' || nodeEnv === 'production') {
  const { UglifyJsPlugin } = webpack.optimize;

  // Removing hot module from the entry array in production fixes
  // EventSource's response has a MIME type ('text/html')
  // that is not 'text/event-stream'. Aborting the connection. error
  config.entry = entry.slice(1);
  config.plugins.push(new UglifyJsPlugin({ minimize: true }));
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }));

  config.devtool = 'source-map';
  config.output.filename += '.min.js';
} else {
  config.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('development')
    }
  }));
  config.devtool = 'cheap-module-eval-sourcemap';
  config.output.filename += '.js';
}

export default config;
