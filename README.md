# react-native-sass-transformer

Load Sass files to [react native style objects](https://facebook.github.io/react-native/docs/style.html).

## Usage

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
    return ["scss", "sass"];
  }
};
```
