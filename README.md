# Invest Web

A framework for building web compoents and application through plugins

## Building

First install [yarn](https://yarnpkg.com).

Run

```
/setup.sh
```

You can then build with:

```
build.sh

#or just

yarn build
```

If you want to clean a previous build use

```
# Delete everything, including dependencies - use yarn bootstrap to get back
yarn clean
# Or just clean up the old builds
yarn clean:build
```

If you want to build the complete invest application refer to the `invest` project which will build both UI and server components.

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

Further documentation is available under `invest` project repository.

## Licence

THis project is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).
