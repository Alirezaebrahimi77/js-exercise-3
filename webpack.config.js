const path = require("path")
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: "development",
    entry: ["./assets/css/style.css", "./assets/js/firebase.js", "./assets/js/utils.js", "./assets/js/index.js", ],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    plugins: [
        new Dotenv()
    ],
    stats: {
        children: true
    },
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'css-loader'
            ]
          }
        ]
      },
    watch: true
}