
const path = require('path');

export default () => (
    {
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, './build'),
            filename: 'vessel.js',
            libraryTarget: 'umd',
            library: 'vessel'
        },
        // externals: {
        //     'lodash': {
        //         commonjs: 'lodash',
        //         commonjs2: 'lodash',
        //         amd: 'lodash',
        //         root: '_'
        //     }
        // },
        module: {
            rules: [
                { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
            ]
        },
    }
);