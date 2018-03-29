# Invest Web

A framework for building web compoents and application through plugins

## Building

First install [yarn](https://yarnpkg.com).

Then install [Lerna](https://lernajs.io/):

```
yarn global add lerna
```

Then download the dependencies and link the sub projects together:

```
yarn bootstrap
```

You can then build with:

```
yarn build
```

If you want to clean a previous build use 

```
# Delete everything, including dependencies - use yarn bootstrap to get back 
yarn clean
# Or just clean up the old builds
yarn clean:build
```

## Developing

If you wantt o develop applications or plugins based on this code you likely want to link these and use live compilation reloading.

To link, run from this directory:

```
yarn link:libs
```

Then in your other project run:

```
yarn link invest-plugin invest-components ...and anything else you need)
```

Your other application will now see the latest build in this directory (over the version in NPM).

To live compile to reflect changes:

```
yarn dev:libs
```

## Documentation

Further documentation is available under `invest-java` project.

## Licence

THis project is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).