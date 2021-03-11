import { SharedConfiguration, SharedConfigurationSymbol } from "@my-lib/config";
import { Container } from "@my-lib/container";
import { inject, injectable } from "inversify";

@injectable()
export class StorageService {
    public constructor(@inject(SharedConfigurationSymbol) private configuration: SharedConfiguration) {
    }

    public doStuff(): boolean {
        if (this.configuration.get('key')) {
            // ...
            return true;
        }
        return false;
    }

}
export const StorageServiceSymbol = Symbol("StorageService");
Container.RegisterService(StorageServiceSymbol, StorageService);
