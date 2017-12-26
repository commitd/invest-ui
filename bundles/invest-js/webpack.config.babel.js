
const path = require('path');
const Visualizer = require('webpack-visualizer-plugin');

export default () => (
    {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, './build'),
            filename: 'vessel.js',
            libraryTarget: 'umd',
            library: 'Vessel'
        },
        plugins: [new Visualizer()],
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
    }
);