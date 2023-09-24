/*eslint-env node*/

import * as esbuild from "esbuild";
import envFilePlugin from "esbuild-envfile-plugin";

let ctx = await esbuild.context({
  entryPoints: ["./src/Scene.ts"],
  bundle: true,
  outfile: "public/Scene.js",
  plugins: [envFilePlugin],
});

await ctx.watch();
console.log("Watching...");

await ctx.serve({
  servedir: "public",
});
