import { Container as InversifyContainer, interfaces } from "inversify";

export class Container {
    private static Container: InversifyContainer|null = null;

    /**
     * Gets the Inversify's container and create it if necessary.
     */
    public static GetContainer(): InversifyContainer {
        if (Container.Container === null) {
            Container.Container = new InversifyContainer();
        }
        return Container.Container;
    }

    /**
     * Gets a service registered in the container.
     */
    public static Get<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): T {
        return Container.GetContainer().get<T>(serviceIdentifier);
    }

    /**
     * Register an object as a module into the container.
     * Modules are transient, a new instance will be created each time they are imported as a dependency.
     */
    public static RegisterModule<T>(symbol: symbol, type: any): interfaces.BindingWhenOnSyntax<T> {
        return Container.GetContainer().bind<T>(symbol).to(type).inTransientScope();
    }

    /**
     * Register an object as a service into the container.
     * Services are singleton, only one instance will be created and will be shared each time it is imported as a dependency.
     */
    public static RegisterService<T>(symbol: symbol, type: any): interfaces.BindingWhenOnSyntax<T> {
        return Container.GetContainer().bind<T>(symbol).to(type).inSingletonScope();
    }

    /**
     * Register a service factory.
     */
    public static RegisterFactory<T>(symbol: symbol, callback: (context: any) => any): interfaces.BindingInWhenOnSyntax<T> {
        return Container.GetContainer().bind<T>(symbol).toDynamicValue(callback);
    }
}
