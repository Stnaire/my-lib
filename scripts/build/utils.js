import fs from 'fs';
import path from 'path';
import { rollup } from 'rollup';
import typescript from 'rollup-plugin-typescript2';
import { Externals } from './externals.js';
import { fileURLToPath } from 'url';
import { Globals} from "./builds.js";
import { terser } from "rollup-plugin-terser";
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate a rollup configuration base on a more abstract definition.
 */
export function getRollupConfig(buildConfig) {
    const externals = Externals.concat(buildConfig.externals || []);
    const rollupConfig = {
        input: buildConfig.entry,
        external: (candidate) => {
            for (const pattern of externals) {
                if (pattern instanceof RegExp) {
                    return candidate.match(pattern);
                }
                if (pattern === candidate) {
                    return true;
                }
            }
            return false;
        },
        plugins: [].concat(buildConfig.plugins || []),
        output: {
            format: buildConfig.format,
            name: buildConfig.moduleName,
            globals: Globals
        }
    };
    if (buildConfig.outputFile) {
        rollupConfig.plugins.push(typescript({
            tsconfig: path.join(buildConfig.rootDir, 'tsconfig.json'),
            tsconfigOverride: {
                compilerOptions: {
                    declaration: false,
                    declarationDir: null
                }
            }
        }));
        rollupConfig.output.file = buildConfig.outputFile;
    } else if (buildConfig.outputDir) {
        rollupConfig.plugins.push(typescript({
            useTsconfigDeclarationDir: true,
            tsconfig: path.join(buildConfig.rootDir, 'tsconfig.json'),
        }));
        rollupConfig.preserveModules = true;
        rollupConfig.output.dir = buildConfig.outputDir;
    }
    if (buildConfig.env === 'production') {
        rollupConfig.plugins.push(terser({
            keep_classnames: true,
            keep_fnames: true
        }));
    }
    Object.defineProperty(rollupConfig, '_name', {
        enumerable: false,
        value: buildConfig.package
    });
    Object.defineProperty(rollupConfig, '_env', {
        enumerable: false,
        value: buildConfig.env || null
    });
    return rollupConfig;
}

/**
 * Call rollup with a finalized configuration and write the output.
 */
export function build(config) {
    const output = config.output;
    console.log(`${chalk.red('Building')} package ${chalk.blue(config._name)} in ${chalk.blue(config.output.format)}${config._env !== null ? chalk.yellow(` (${config._env})`) : ''} format.`);
    return rollup(config)
        .then(bundle => bundle.write(output))
        .then(() => {
            /**
             * I can't find a way to make typings generate in the root of the "dist" folder.
             * Because the original "tsconfig.json" file is two levels up, the subdirectories are always present
             * and I didn't find how to removed them.
             *
             * That's why the build output dir is a subdirectory (see in builds.js the "outputDir" of each package is set to `packages/${config.package}/build/${config.package}/src`).
             * With that both the types and the js files are in the same directories.
             *
             * Then here I just move the
             */
            if (config.output.format === 'es') {
                const dir = config.output.dir || path.dirname(config.output.file);
                const packageRoot = dir.substring(0, dir.length - (4 /* /src */ + config._name.length + 6 /* build/ */));
                fs.renameSync(dir, packageRoot + '_build');
                fs.rmdirSync(packageRoot + 'build', {recursive: true});
                fs.renameSync(packageRoot + '_build', packageRoot + 'build');
            }
        });
}

/**
 * Remove the "dist" and "build" directory for each package in the configs array.
 */
export function cleanupBuilds(configs) {
    const cleaned = [];
    for (const config of configs) {
        const packageName = config.package;
        if (packageName && cleaned.indexOf(packageName) < 0) {
            console.log(`${chalk.red('Cleaning')} builds of package ${chalk.blue(packageName)}.`);
            const packageRootDir = path.resolve(__dirname, `../../packages/${packageName}`);
            const targets = [
                packageRootDir + '/dist',
                packageRootDir + '/build'
            ];
            for (const target of targets) {
                if (fs.existsSync(target)) {
                    fs.rmdirSync(target, {recursive: true});
                }
            }
            cleaned.push(packageName);
        }
    }
    if (cleaned.length > 0) {
        console.log('');
    }
}

export function filterBuilds(builds, filter) {
    builds = Object.assign({}, builds);
    if (!filter) {
        return builds;
    }
    const filters = filter.split(',').map((e) => new RegExp(e));
    return Object.keys(builds)
        .filter(key => filters.includes(key))
        .reduce((obj, key) => {
            obj[key] = raw[key];
            return obj;
        }, {});
}
