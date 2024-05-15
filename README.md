# react-native-sass-transformer [![NPM version](http://img.shields.io/npm/v/react-native-sass-transformer.svg)](https://www.npmjs.org/package/react-native-sass-transformer) [![Downloads per month](https://img.shields.io/npm/dm/react-native-sass-transformer.svg)](http://npmcharts.com/compare/react-native-sass-transformer?periodLength=30) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

Use [Sass](https://sass-lang.com/) to style your React Native apps.

Behind the scenes the Sass files are transformed to [react native style objects](https://facebook.github.io/react-native/docs/style.html) (look at the examples).

> This transformer can be used together with [React Native CSS modules](https://github.com/kristerkari/react-native-css-modules).

## How does it work?

Your `App.scss` file might look like this:

```scss
%blue {
  color: blue;
}
.myClass {
  @extend %blue;
}
.myOtherClass {
  color: red;
}
.my-dashed-class {
  color: green;
}
```

When you import your stylesheet:

```js
import styles from "./App.scss";
```

Your imported styles will look like this:

```js
var styles = {
  myClass: {
    color: "blue"
  },
  myOtherClass: {
    color: "red"
  },
  "my-dashed-class": {
    color: "green"
  }
};
```

You can then use that style object with an element:

**Plain React Native:**

```jsx
<MyElement style={styles.myClass} />

<MyElement style={styles["my-dashed-class"]} />
```

**[React Native CSS modules](https://github.com/kristerkari/react-native-css-modules) using [className](https://github.com/kristerkari/babel-plugin-react-native-classname-to-style) property:**

```jsx
<MyElement className={styles.myClass} />

<MyElement className={styles["my-dashed-class"]} />
```

**[React Native CSS modules](https://github.com/kristerkari/react-native-css-modules) using [styleName](https://github.com/kristerkari/babel-plugin-react-native-stylename-to-style) property:**

```jsx
<MyElement styleName="myClass my-dashed-class" />
```

_Please use the `.scss` file extension for SCSS syntax and the `.sass` file extension for indented Sass syntax._

## Installation and configuration

### Step 1: Install

```sh
yarn add --dev react-native-sass-transformer sass
```

### Step 2: Configure the react native packager

#### For Expo SDK v41.0.0 or newer

Merge the contents from your project's `metro.config.js` file with this config (create the file if it does not exist already).

`metro.config.js`:

```js
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-sass-transformer")
  };
  config.resolver = {
    ...resolver,
    sourceExts: [...sourceExts, "scss", "sass"]
  };

  return config;
})();
```

---

#### For React Native v0.72.1 or newer

Merge the contents from your project's `metro.config.js` file with this config (create the file if it does not exist already).

`metro.config.js`:

```js
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve("react-native-sass-transformer")
  },
  resolver: {
    sourceExts: [...sourceExts, "scss", "sass"]
  }
};

module.exports = mergeConfig(defaultConfig, config);
```

## Platform specific extensions

If you need [React Native's platform specific extensions](https://facebook.github.io/react-native/docs/platform-specific-code.html#platform-specific-extensions) for your Sass files, you can use [babel-plugin-react-native-platform-specific-extensions](https://github.com/kristerkari/babel-plugin-react-native-platform-specific-extensions). Platform specific extensions for files imported using Sass' `@import` are supported by default.

## Sass options

If you need to pass options (e.g. functions) to `sass`, you can do so by creating a `transformer.js` file and doing the following:

```js
const upstreamTransformer = require("@react-native/metro-babel-transformer");
const sassTransformer = require("react-native-sass-transformer");

module.exports.transform = function ({ src, filename, options, ...rest }) {
  if (filename.endsWith(".scss") || filename.endsWith(".sass")) {
    const opts = Object.assign(options, {
      sassOptions: {
        functions: {
          "rem($px)": (px) => {
            px.setValue(px.getValue() / 16);
            px.setUnit("rem");
            return px;
          }
        }
      }
    });
    return sassTransformer.transform({ src, filename, options: opts, ...rest });
  } else {
    return upstreamTransformer.transform({ src, filename, options, ...rest });
  }
};
```

After that in `metro.config.js` point the `babelTransformerPath` to that file:

```js
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve("./transformer.js")
  },
  resolver: {
    sourceExts: [...sourceExts, "scss", "sass"]
  }
};

module.exports = mergeConfig(defaultConfig, config);
```

## CSS Custom Properties (CSS variables)

_You need version 1.4.0 or newer_

```css
:root {
  --text-color: blue;
}

.blue {
  color: var(--text-color);
}
```

CSS variables are not supported by default, but you can add support for them by using [PostCSS](https://postcss.org/) and [postcss-css-variables](https://github.com/MadLittleMods/postcss-css-variables#readme) plugin.

Start by installing dependencies:

```sh
yarn add postcss postcss-css-variables react-native-postcss-transformer --dev
```

Add `postcss-css-variables` to your PostCSS configuration with [one of the supported config formats](https://github.com/michael-ciniawsky/postcss-load-config), e.g. `package.json`, `.postcssrc`, `postcss.config.js`, etc.

After that create a `transformer.js` file and do the following:

```js
const upstreamTransformer = require("@react-native/metro-babel-transformer");
const sassTransformer = require("react-native-sass-transformer");
const postCSSTransformer = require("react-native-postcss-transformer");

module.exports.transform = function ({ src, filename, ...rest }) {
  if (filename.endsWith(".scss") || filename.endsWith(".sass")) {
    return sassTransformer
      .renderToCSS({ src, filename, options })
      .then((css) =>
        postCSSTransformer.transform({ src: css, filename, ...rest })
      );
  } else {
    return upstreamTransformer.transform({ src, filename, ...rest });
  }
};
```

After that in `metro.config.js` point the `babelTransformerPath` to that file:

```js
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve("./transformer.js")
  },
  resolver: {
    sourceExts: [...sourceExts, "scss", "sass"]
  }
};

module.exports = mergeConfig(defaultConfig, config);
```

## Dependencies

This library has the following Node.js modules as dependencies:

- [app-root-path](https://github.com/inxilpro/node-app-root-path)
- [css-to-react-native-transform](https://github.com/kristerkari/css-to-react-native-transform)
