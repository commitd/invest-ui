
const path = require('path');
var webpack = require('webpack');
// const Visualizer = require('webpack-visualizer-plugin');

export default () => (
    {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, './build'),
            filename: 'invest.js',
            libraryTarget: 'umd',
            library: 'Invest'
        },
        // plugins: [new Visualizer()],
        externals: {
            react: {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react',
                umd: 'react',
            },
            'react-dom': {
                root: 'ReactDOM',
                commonjs2: 'react-dom',
                commonjs: 'react-dom',
                amd: 'react-dom',
                umd: 'react-dom',
            },
        },
        module: {
            rules: [
                { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
            ]
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin({ mangle: false })
        ]
    }
);