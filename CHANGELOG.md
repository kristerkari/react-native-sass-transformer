## v2.0.0

- Breaking: Changed to use the `sass` npm package instead of the deprecated `node-sass` package. Please update your dependencies.

## v1.4.0

- Added: `renderToCSS` method. It can be used together with the PostCSS transformer to add support for CSS variables.

## v1.3.3

- Updated: `semver` dependency to v5.6.0.
- Updated: `css-to-react-native-transform` dependency to v1.8.1.

## v1.3.2

- Fixed: Compatibility with react-native v0.59

## v1.3.1

- Fixed: Removed code to throw an error when a Sass include path can not be resolved. This fixes Sass' "directories as modules" feature.

## v1.3.0

- Added: support for passing options to `node-sass`.
- Added: support for platform specific extensions when using Sass' `@import`.

## v1.2.3

- Fixed: Pass `indentedSyntax` option to `node-sass` to enable support for indented syntax using `.sass` file extension.

## v1.2.2

- Updated: `app-root-path` dependency to v2.1.0.
- Updated: `css-to-react-native-transform` dependency to v1.7.0.

## v1.2.1

- Fixed: Compatibility with react-native v0.56

## v1.2.0

- Updated: `css-to-react-native-transform` dependency to v1.6.0.
- Added: enabled parsing of CSS viewport units (does not work without `babel-plugin-react-native-classname-to-dynamic-style`).

## v1.1.3

- Fixed: use `app-root-path` package to correctly get project's root folder.

## v1.1.2

- Fixed: added project's root path to `includePaths` option to fix `@import`s from top level.

## v1.1.1

- Fixed: added `includePaths` option to fix `@import`s.

## v1.1.0

- Added: enabled parsing of CSS Media Queries.

## v1.0.7

- Updated: `css-to-react-native-transform` dependency to v1.4.0.

## v1.0.6

- Updated: `css-to-react-native-transform` dependency to v1.0.8.

## v1.0.5

- Updated: `css-to-react-native-transform` dependency to v1.0.7.

## v1.0.4

- Updated: `css-to-react-native-transform` dependency to v1.0.6.

## v1.0.3

- Updated: `css-to-react-native-transform` dependency to v1.0.5.

## v1.0.2

- Updated: `css-to-react-native-transform` dependency.

## v1.0.1

- Fixed: Compatibility with react-native v0.52

## v1.0.0

- Initial release
