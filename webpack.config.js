const path = require('path');

module.exports = {
  entry: {
    main: {
      import: './src/main.js',
    },
  },
    output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'main.bundle.js'
  },
  devServer: {
    open: true,
    hot: true,
    port: 3000,
		static: {
			directory: path.join(__dirname, 'public')
		}
  },
  module: {
    rules: [
       {
          test: /\.(m?js|ts)$/,
          exclude: /(node_modules)/,
          use:  ['swc-loader']
        },
    ]
  },
  resolve: {
    extensions: ['.js', '.ts'],
  }
}
