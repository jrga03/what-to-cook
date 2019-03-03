/* eslint-disable no-var */
var webpack = require( 'webpack' );
var path = require( 'path' );

var parentDir = path.join( __dirname, '../' );

module.exports = {
    entry: [
        path.join( parentDir, 'app/app.js' )
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use:['babel-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [ 'babel-loader', 'eslint-loader' ]
            },
            {
                test: /\.less$/,
                use: [ 'style-loader', 'css-loder', 'less-loader' ]
            }
        ]
    },
    resolve: {
        extensions: [ '*', '.js', '.jsx' ]
    },
    output: {
        path: `${parentDir}dist`,
        publicPath: '/',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: `${parentDir}app`,
        historyApiFallback: true,
        hot: true
    }
}
