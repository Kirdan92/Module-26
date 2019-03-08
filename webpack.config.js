const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeJsPlugin = require("optimize-js-plugin");

var env = (process.env.NODE_ENV || "development").trim();

console.log("NODE_ENV:", env);

function getPlugins() {
	var plugins = [
		new HtmlWebpackPlugin({
			template: "client/index.html",
			filename: "index.html",
			inject: "body"
		})
	];
	if (env === "production") {
		plugins.push(
			new OptimizeJsPlugin({
				sourceMap: false
			})
		);
	} else {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

	return plugins;
}

module.exports = {
	entry: (env !== "production"
		? [
				"react-hot-loader/patch",
				"webpack-dev-server/client?http://localhost:8080",
				"webpack/hot/only-dev-server"
		  ]
		: []
	).concat(["./client/index.js"]),
	output: {
		filename: "./bundle.js",
		path: path.resolve(__dirname, "public")
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			},
			{
				test: /\.css$/,
				use: [
					{ loader: "style-loader" },
					{
						loader: "css-loader",
						options: {
							modules: true
						}
					}
				]
			}
		]
	},
  devServer: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,
      },
    },
  },
	plugins: getPlugins()
};