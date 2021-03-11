import { Container } from "@my-lib/container/container";
import { VarHolder } from "@my-lib/storage/var-holder";
import { injectable } from "inversify";

@injectable()
export class SharedConfiguration extends VarHolder {

}
export const SharedConfigurationSymbol = Symbol("SharedConfiguration");
Container.RegisterService(SharedConfigurationSymbol, SharedConfiguration);
