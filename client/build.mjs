/*eslint-env node*/

import * as esbuild from "esbuild";
import envFilePlugin from "esbuild-envfile-plugin";

await esbuild.build({
  entryPoints: ["./src/Scene.ts"],
  bundle: true,
  minify: true,
  outfile: "public/Scene.js",
  plugins: [envFilePlugin],
});
