import { Container } from "@my-lib/container";
import { VarHolder } from "@my-lib/storage";
import { injectable } from "inversify";

@injectable()
export class SharedConfiguration extends VarHolder {

}
export const SharedConfigurationSymbol = Symbol("SharedConfiguration");
Container.RegisterService(SharedConfigurationSymbol, SharedConfiguration);
