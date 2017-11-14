const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');
module.exports = (baseConfig, env) => {
    const config = genDefaultConfig(baseConfig, env);

    // For Typescript
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        loader: require.resolve('awesome-typescript-loader')
    });

    // For reading markdown files (for storybook-readme)
    config.module.rules.push({
        test: /\.md$/,
        loader: require.resolve('raw-loader')

    })
    config.resolve.extensions.push('.ts', '.tsx', '.md');
    return config;
};