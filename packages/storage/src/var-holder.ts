import { injectable } from "inversify";

/**
 * Oversimplified copy of a class really in use in the "storage" package.
 * It is used in many packages, thus creating circular dependencies with the "storage" package.
 *
 * I could isolate the class in it's own package but it feels ugly. There is not circular dependency between
 * "VarHolder" and another component, the circular dependency problem only comes from how the packages are built / exported.
 */
@injectable()
export class VarHolder {
    protected bag: Record<string, any> = {};

    /**
     * Get a value stored in the bag.
     */
    public get(key: string, defaultValue: any = null): any {
        if (typeof(this.bag[key]) !== 'undefined') {
            return this.bag[key];
        }
        return defaultValue;
    }

    /**
     * Set a value in the bag.
     */
    public set(key: string, value: any): void {
        this.bag[key] = value;
    }
}
