const config = {
    entry: {
        etGrid: `${__dirname}/src/etGrid`
    },
    output: {
        path: `${__dirname}/public`,
        filename: '[name].min.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
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
    }

};

module.exports = config;
