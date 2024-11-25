import serve from "rollup-plugin-serve";
import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";

console.info("dd", process.argv);

export default {
  input: "src/main.js",
  output: [
    {
      file: "build/bundle.js",
      format: "umd",
      name: "mika_code_viewer",
      sourcemap: true,
    },
    {
      file: "build/bundle.esm.js",
      format: "esm",
      name: "mika_code_viewer",
      sourcemap: true,
    },
  ],
  context: "window",
  plugins: [
    commonjs({
      include: /node_modules/,
    }),
    serve({
      port: 8200,
      open: true,
      contentBase: ".",
    }),
    resolve(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ],
};
