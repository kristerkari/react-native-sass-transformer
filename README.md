# react-native-sass-transformer

[![NPM version](http://img.shields.io/npm/v/react-native-sass-transformer.svg)](https://www.npmjs.org/package/react-native-sass-transformer)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

Load Sass files to [react native style objects](https://facebook.github.io/react-native/docs/style.html).

> This transformer can be used together with [React Native CSS modules](https://github.com/kristerkari/react-native-css-modules).

## Usage

Please use the `.scss` file extension for SCSS syntax and the `.sass` file extension for indented Sass syntax.

### Step 1: Install

```sh
yarn add --dev react-native-sass-transformer node-sass
```

### Step 2: Configure the react native packager

Add this to your `rn-cli.config.js` (make one if you don't have one already):

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
  }
};
```

You can then use that style object with an element:

```jsx
<MyElement style={styles.myClass} />
```
