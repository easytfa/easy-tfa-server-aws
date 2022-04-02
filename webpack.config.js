/* eslint-disable */
// Version if the local Node.js version supports async/await
// webpack.config.js

const path = require('path');
const slsw = require('serverless-webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (async () => {
  return {
    mode: 'production',
    entry: slsw.lib.entries,
    target: 'node',
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    externals: {
      'aws-sdk': 'aws-sdk',
      'aws-sdk/clients/dynamodb': 'aws-sdk/clients/dynamodb',
      'aws-sdk/clients/apigatewaymanagementapi': 'aws-sdk/clients/apigatewaymanagementapi',
    },
    module: {
      rules: [
        {
          test: /.tsx?$/,
          include: path.resolve(__dirname, 'src'),
          use: [{
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
              transpileOnly: true,
            },
          }],
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      plugins: [new TsconfigPathsPlugin({})],
    },
  };
})();
