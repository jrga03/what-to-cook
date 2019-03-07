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
                test: /\.css$/,
                use: [ 'style-loader', 'css-loder' ]
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-url-loader',
                        options: {
                            // Inline files smaller than 10 kB
                            limit: 10 * 1024,
                            noquotes: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // Inline files smaller than 10 kB
                            limit: 10 * 1024
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                enabled: false
                                // NOTE: mozjpeg is disabled as it causes errors in some Linux environments
                                // Try enabling it in your environment by switching the config to:
                                // enabled: true,
                                // progressive: true,
                            },
                            gifsicle: {
                                interlaced: false
                            },
                            optipng: {
                                optimizationLevel: 7
                            },
                            pngquant: {
                                quality: '65-90',
                                speed: 4
                            }
                        }
                    }
                ]
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
