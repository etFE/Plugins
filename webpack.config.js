const ProgressbarWebpack = require('progress-bar-webpack-plugin');
const Webpack = require('webpack');

const dateTime = new Date();
const config = {
    entry: {
        common: `${__dirname}/src/common`,
        etSelect: `${__dirname}/src/etSelect`,
        etCheck: `${__dirname}/src/etCheck`,
        etTab: `${__dirname}/src/etTab`,
        etDialog: `${__dirname}/src/etDialog`,
        etGrid: `${__dirname}/src/etGrid`,
        etValidate: `${__dirname}/src/etValidate`,
        etDatepicker: `${__dirname}/src/etDatepicker`,
        etDatepaging: `${__dirname}/src/etDatepaging`,
        etTree: `${__dirname}/src/etTree`,
        etUpload: `${__dirname}/src/etUpload`,
        etForm: `${__dirname}/src/etForm`,
        etJsonLayout: `${__dirname}/src/etJsonLayout`,
        etSortable: `${__dirname}/src/etSortable`,
        etCharacterList: `${__dirname}/src/etCharacterList`
    },
    output: {
        path: `${__dirname}/public`,
        filename: '[name].min.js'
    },
    devServer: {
        contentBase: './src',
        historyApiFallback: true,
        inline: true
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
            { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
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
