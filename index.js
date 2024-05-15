const sass = require("sass");
const css2rn = require("css-to-react-native-transform").default;
const path = require("path");
const fs = require("fs");
const appRoot = require("app-root-path");

/**
 * `metro-react-native-babel-transformer` has recently been migrated to the React Native
 * repository and published under the `@react-native/metro-babel-transformer` name.
 * The new package is default on `react-native` >= 0.73.0, so we need to conditionally load it.
 *
 * Additionally, Expo v50.0.0 has begun using @expo/metro-config/babel-transformer as its upstream transformer.
 * To avoid breaking projects, we should prioritze that package if it is available.
 */
const upstreamTransformer = (() => {
  try {
    return require("@expo/metro-config/babel-transformer");
  } catch (error) {
    try {
      return require("@react-native/metro-babel-transformer");
    } catch (error) {
      return require("metro-react-native-babel-transformer");
    }
  }
})();

// Iterate through the include paths and extensions to find the file variant
function findVariant(name, extensions, includePaths) {
  for (let i = 0; i < includePaths.length; i++) {
    const includePath = includePaths[i];

    // try to find the file iterating through the extensions, in order.
    const foundExtention = extensions.find((extension) => {
      const fname = includePath + "/" + name + extension;
      const partialfname = includePath + "/_" + name + extension;
      return fs.existsSync(fname) || fs.existsSync(partialfname);
    });

    if (foundExtention) {
      return includePath + "/" + name + foundExtention;
    }
  }

  return false;
}

function renderToCSS({ src, filename, options }) {
  const ext = path.extname(filename);
  const exts = [
    // add the platform specific extension, first in the array to take precedence
    options.platform === "android" ? ".android" + ext : ".ios" + ext,
    ".native" + ext,
    ext
  ];
  const defaultOpts = {
    includePaths: [path.dirname(filename), appRoot],
    indentedSyntax: filename.endsWith(".sass"),
    importer: function (url /*, prev, done */) {
      // url is the path in import as is, which LibSass encountered.
      // prev is the previously resolved path.
      // done is an optional callback, either consume it or return value synchronously.
      // this.options contains this options hash, this.callback contains the node-style callback

      const urlPath = path.parse(url);
      const importerOptions = this.options;
      const incPaths = importerOptions.includePaths.slice(0).split(":");

      if (urlPath.dir.length > 0) {
        incPaths.unshift(path.resolve(path.dirname(filename), urlPath.dir)); // add the file's dir to the search array
      }
      const f = findVariant(urlPath.name, exts, incPaths);

      if (f) {
        return { file: f };
      }
    }
  };

  const opts = options.sassOptions
    ? Object.assign(defaultOpts, options.sassOptions, { data: src })
    : Object.assign(defaultOpts, { data: src });

  const result = sass.renderSync(opts);
  const css = result.css.toString();
  return css;
}

function renderToCSSPromise(css) {
  return Promise.resolve(renderToCSS(css));
}

function renderCSSToReactNative(css) {
  return css2rn(css, { parseMediaQueries: true });
}

module.exports.transform = async ({ src, filename, ...rest }) => {
  if (filename.endsWith(".scss") || filename.endsWith(".sass")) {
    const css = renderToCSS({ src, filename, ...rest });
    const cssObject = renderCSSToReactNative(css);
    return upstreamTransformer.transform({
      src: "module.exports = " + JSON.stringify(cssObject),
      filename,
      ...rest
    });
  }
  return upstreamTransformer.transform({ src, filename, ...rest });
};

module.exports.renderToCSS = renderToCSSPromise;
