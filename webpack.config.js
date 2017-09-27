const ProgressbarWebpack = require('progress-bar-webpack-plugin');
const Webpack = require('webpack');

const dateTime = new Date();
const config = {
    entry: {
        etSelect: `${__dirname}/src/etSelect`,
        etCheck: `${__dirname}/src/etCheck`
    },
    output: {
        path: `${__dirname}/public`,
        filename: '[name].min.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
            { test: /\.sass$/, loader: 'style-loader!css-loader!sass-loader' },
            { test: /\.(gif|jpg|png)\??.*$/, loader: 'url-loader?limit=25000' },
            { test: /\.svg/, loader: 'svg-url-loader' },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    // devtool: 'cheap-source-map',
    externals: {
        jquery: 'jQuery'
    },
    plugins: [
        new ProgressbarWebpack(),
        new Webpack.BannerPlugin(`[name]   ${dateTime}`)
    ]
};

module.exports = config;
