import { Builds } from "./builds.js";
import { build, cleanupBuilds, filterBuilds, getRollupConfig } from './utils.js';

let filteredBuilds = filterBuilds(Builds, process.argv[2]);
let keys = Object.keys(filteredBuilds);
let index = 0;
const total = keys.length;
const next = () => {
    build(getRollupConfig(filteredBuilds[keys[index++]])).then(() => {
        if (index < total) {
            next();
        }
    }).catch(console.error);
}
cleanupBuilds(Object.values(filteredBuilds));
next();
