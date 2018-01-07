var sass = require("node-sass");
var css2rn = require("css-to-react-native-transform").default;

let upstreamTransformer = null;

try {
  // handle RN >= 0.47
  upstreamTransformer = require("metro-bundler/src/transformer");
} catch (e) {
  try {
    // handle RN 0.46
    upstreamTransformer = require("metro-bundler/build/transformer");
  } catch (e) {
    // handle RN <= 0.45
    const oldUpstreamTransformer = require("react-native/packager/transformer");
    upstreamTransformer = {
      transform({ src, filename, options }) {
        return oldUpstreamTransformer.transform(src, filename, options);
      }
    };
  }
}

module.exports.transform = function(src, filename, options) {
  if (typeof src === "object") {
    // handle RN >= 0.46
    ({ src, filename, options } = src);
  }

  if (filename.endsWith(".scss") || filename.endsWith(".sass")) {
    var result = sass.renderSync({
      data: src
    });
    var css = result.css.toString();
    var cssObject = css2rn(css);

    return upstreamTransformer.transform({
      src: "module.exports = " + JSON.stringify(cssObject),
      filename,
      options
    });
  } else {
    return upstreamTransformer.transform({ src, filename, options });
  }
};
