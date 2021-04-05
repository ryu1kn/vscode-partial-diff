'use strict'

const path = require('path')

console.info(`
>> You can safely ignore following WARNINGs as they are optional dependencies.
>>
>>   WARNING in ./node_modules/applicationinsights/out/AutoCollection/NativePerformance.js 49:44-89
>>   Module not found: Error: Can't resolve 'applicationinsights-native-metrics' in './node_modules/applicationinsights/out/AutoCollection'
>>
>>   WARNING in ./node_modules/diagnostic-channel-publishers/dist/src/azure-coretracing.pub.js 24:26-71
>>   Module not found: Error: Can't resolve '@opentelemetry/tracing' in './node_modules/diagnostic-channel-publishers/dist/src'
>>
>> For more details, see:
>>
>> * https://github.com/microsoft/ApplicationInsights-node.js/blob/c3f9d86e6149098348181077934b008766237ba2/README.md#extended-metrics
>> * https://github.com/microsoft/node-diagnostic-channel/issues/72#issuecomment-632228392
`)

module.exports = {
  target: 'node',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    library: {type: 'commonjs2'},
    devtoolModuleFilenameTemplate: '../[resource-path]',
  },
  devtool: 'source-map',
  externals: {
    vscode: 'commonjs vscode'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [{
        loader: 'ts-loader'
      }]
    }]
  },
}
