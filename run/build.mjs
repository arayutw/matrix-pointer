import fs from "fs";
import uglifyJs from "uglify-js";
import { rollup } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import { getBabelOutputPlugin } from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

[
    {
        dist: "/matrix-pointer.js",
        format: "umd",
        minify: false,
        name: "MatrixPointer",
    },
    {
        dist: "/matrix-pointer.min.js",
        format: "umd",
        minify: true,
        name: "MatrixPointer",
    },
    {
        dist: "/matrix-pointer.cjs.js",
        format: "cjs",
        minify: false,
    },
    {
        dist: "/matrix-pointer.cjs.min.js",
        format: "cjs",
        minify: true,
    },
    {
        dist: "/matrix-pointer.esm.js",
        format: "es",
        minify: false,
    },
    {
        dist: "/matrix-pointer.esm.min.js",
        format: "es",
        minify: true,
    },
].forEach((options) => {
    rollup({
        input: "src/scripts/index.ts",
        plugins: [
            nodeResolve(),
            typescript({
                tsconfig: "./tsconfig.json",
                sourceMap: false,
                mapRoot: undefined,
                declaration: false,
                declarationDir: undefined,
            }),
            esbuild({
                minify: false,
            }),
            getBabelOutputPlugin({
                configFile: './.babelrc',
                allowAllFormats: true,
            }),
            ...(options.minify ? [{
                name: 'minify',
                renderChunk(code) {
                    const result = uglifyJs.minify(code, {
                        sourceMap: true,
                        compress: {
                            passes: 20,
                        },
                        output: {
                            comments: /^(\*)*?!/,
                        },
                        toplevel: true,
                        mangle: {
                            properties: {
                                regex: /^_/,
                            },
                        },
                    });
                    if (result.error) {
                        throw result.error;
                    }
                    return result;
                },
            }] : []),
        ],
    })
        .then((rollupBuild) => {
            const path = "dist/scripts" + options.dist;
            const info = JSON.parse(fs.readFileSync("package.json", "utf-8"));
            return Promise.all([
                path,
                rollupBuild.write({
                    banner: `/**!
* ` + info.name.split("/")[1] + ` ` + info.version + `
* MIT License
* Copyright (c) ` + (new Date).getFullYear() + ` Yuta Arai
**/`,
                    file: path,
                    format: options.format,
                    sourcemap: false,
                    ...(options.name ? {
                        name: options.name,
                    } : {})
                }),
            ]);
        })
        .then(([path, output]) => console.log("put", path))
        .catch(err => console.error("error: ", err));
});
