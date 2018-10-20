# react-native-sass-transformer [![NPM version](http://img.shields.io/npm/v/react-native-sass-transformer.svg)](https://www.npmjs.org/package/react-native-sass-transformer) [![Downloads per month](https://img.shields.io/npm/dm/react-native-sass-transformer.svg)](http://npmcharts.com/compare/react-native-sass-transformer?periodLength=30) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

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
yarn add --dev react-native-sass-transformer node-sass
```

### Step 2: Configure the react native packager

#### For React Native v0.57 or newer

Add this to `rn-cli.config.js` in your project's root (create the file if it does not exist already):

```js
const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const {
    resolver: { sourceExts }
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve("react-native-sass-transformer")
    },
    resolver: {
      sourceExts: [...sourceExts, "scss", "sass"]
    }
  };
})();
```

---

#### For React Native v0.56 or older

Add this to `rn-cli.config.js` in your project's root (create the file if it does not exist already):

```js
module.exports = {
  getTransformModulePath() {
    return require.resolve("react-native-sass-transformer");
  },
  getSourceExts() {
    return ["js", "jsx", "scss", "sass"];
  }
};
```

...or if you are using [Expo](https://expo.io/), in `app.json`:

```json
{
  "expo": {
    "packagerOpts": {
      "sourceExts": ["js", "jsx", "scss", "sass"],
      "transformer": "node_modules/react-native-sass-transformer/index.js"
    }
  }
}
```

## Platform specific extensions

If you need [React Native's platform specific extensions](https://facebook.github.io/react-native/docs/platform-specific-code.html#platform-specific-extensions) for your Sass files, you can use [babel-plugin-react-native-platform-specific-extensions](https://github.com/kristerkari/babel-plugin-react-native-platform-specific-extensions). Platform specific extensions for files imported using Sass' `@import` are supported by default.

## Sass options

If you need to pass options (e.g. functions) to `node-sass`, you can do so by creating a `transformer.js` file and doing the following:

```js
var upstreamTransformer = require("metro/src/transformer");
var sassTransformer = require("react-native-sass-transformer");

module.exports.transform = function({ src, filename, options }) {
  if (filename.endsWith(".scss") || filename.endsWith(".sass")) {
    var opts = Object.assign(options, {
      sassOptions: {
        functions: {
          "rem($px)": px => {
            px.setValue(px.getValue() / 16);
            px.setUnit("rem");
            return px;
          }
        }
      }
    });
    return sassTransformer.transform({ src, filename, options: opts });
  } else {
    return upstreamTransformer.transform({ src, filename, options });
  }
};
```

After that in `rn-cli.config.js` point the `babelTransformerPath` to that file:

```js
const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const {
    resolver: { sourceExts }
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve("./transformer.js")
    },
    resolver: {
      sourceExts: [...sourceExts, "scss", "sass"]
    }
  };
})();
```

## Dependencies

This library has the following Node.js modules as dependencies:

- [app-root-path](https://github.com/inxilpro/node-app-root-path)
- [css-to-react-native-transform](https://github.com/kristerkari/css-to-react-native-transform)
- [semver](https://github.com/npm/node-semver#readme)
