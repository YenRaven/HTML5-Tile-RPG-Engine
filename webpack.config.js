const path = require('path');

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
    publicPath: "/"
  },

  module: {

    rules: [
      {
        "test": /\.jsx?$/,
        "loader": "babel-loader",
        "options": {
          "presets": ["flow", "env"]
        }
      }
    ],
  },

  resolve: {
    modules: [
      "node_modules"
    ]
  },
  devtool: "source-map",
  context: __dirname,
  target: "web",
  plugins: [
    // ...
  ],
}
