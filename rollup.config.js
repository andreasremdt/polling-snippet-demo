import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/polling-widget.js",
  output: {
    dir: "dist",
    sourcemap: true,
  },
  plugins: [babel({ babelHelpers: "inline" }), terser()],
};
