import { Builds } from "./builds.js";
import { cleanupBuilds, filterBuilds } from './utils.js';

cleanupBuilds(Object.values(filterBuilds(Builds, process.argv[2])));
