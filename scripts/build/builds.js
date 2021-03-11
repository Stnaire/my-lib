import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolve(p) {
    return path.resolve(__dirname, '../../', p)
}

function createBuildVariants(config) {
    // Excluding all "@my-lib/..." imports for anything OTHER than the current package.
    const externals = [new RegExp(`^@my-lib/((?!${config.package}).)+`)];
    return {
        // CommonJS (for nodejs or bundlers)
        [`${config.package}-cjs-dev`]: {
            package: config.package,
            rootDir: resolve(`packages/${config.package}`),
            entry: resolve(`packages/${config.package}/src/index.ts`),
            outputFile: resolve(`packages/${config.package}/dist/index.cjs.dev.js`),
            format: 'cjs',
            env: 'development',
            moduleName: config.module,
            externals
        },
        [`${config.package}-cjs-prod`]: {
            package: config.package,
            rootDir: resolve(`packages/${config.package}`),
            entry: resolve(`packages/${config.package}/src/index.ts`),
            outputFile: resolve(`packages/${config.package}/dist/index.cjs.prod.js`),
            format: 'cjs',
            env: 'production',
            moduleName: config.module,
            externals
        },
        // ES (for bundlers)
        [`${config.package}-esm`]: {
            package: config.package,
            rootDir: resolve(`packages/${config.package}`),
            entry: resolve(`packages/${config.package}/src/index.ts`),
            outputDir: `packages/${config.package}/build/${config.package}/src`,
            format: 'es',
            moduleName: config.module,
            externals
        },
        // UMD (for browser)
        [`${config.package}-umd-dev`]: {
            package: config.package,
            rootDir: resolve(`packages/${config.package}`),
            entry: resolve(`packages/${config.package}/src/index.ts`),
            outputFile: resolve(`packages/${config.package}/dist/index.umd.dev.js`),
            format: 'umd',
            env: 'development',
            moduleName: config.module,
            externals
        },
        [`${config.package}-umd-prod`]: {
            package: config.package,
            rootDir: resolve(`packages/${config.package}`),
            entry: resolve(`packages/${config.package}/src/index.ts`),
            outputFile: resolve(`packages/${config.package}/dist/index.umd.prod.js`),
            format: 'umd',
            env: 'production',
            moduleName: config.module,
            externals
        }
    };
}

export const Builds = Object.assign({},
    createBuildVariants({
        package: 'config',
        module: 'MyLibConfig'
    }),
    createBuildVariants({
        package: 'container',
        module: 'MyLibContainer'
    }),
    createBuildVariants({
        package: 'storage',
        module: 'MyLibStorage'
    }),
);

/**
 * Define the mapping of externals.
 */
export const Globals = {
    'inversify': 'Inversify'
};
for (const build of Object.keys(Builds)) {
    Globals[`@my-lib/${Builds[build].package}`] = Builds[build].moduleName;
}
