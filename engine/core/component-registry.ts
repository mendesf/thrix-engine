import type { Component } from "./component";
import { type TypeConstructor, TypeRegistry } from "./type-registry";

export type ComponentConstructor<T extends Component = Component> = TypeConstructor<T>;

export class ComponentRegistry extends TypeRegistry<Component, ComponentConstructor> {}
