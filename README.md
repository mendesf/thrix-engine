# thrix

**thrix** is an experimental 2D game engine for the browser written in TypeScript.  
The main goal is to explore an **Entity–Component–System (ECS)** architecture, a **plugin‑based design**, and clean separation between the engine core and example games.

> ⚠️ Work in progress – APIs and structure may change frequently.

---

## Goals

- Experiment with:
  - ECS design for games (entities, components, systems)
  - Update loops and system scheduling
  - Plugin-based architecture (rendering, stats, utilities)
  - Browser-friendly tooling (TypeScript, Vite, npm scripts)
- Build small example scenes (like the `bunny` example) to measure performance and usability.
- Keep the core engine small and reusable, with most features implemented as plugins.

---

## Project structure

- `engine/` – core engine code:
  - ECS world, entities, components, systems
  - plugin and app builders
  - utilities and data structures (e.g. bitsets)
- `plugins/` – optional extensions and integrations:
  - rendering (e.g. PixiJS)
  - stats / debug utilities
  - other game-related helpers
- `examples/bunny/` – example scene showing how to:
  - configure the engine
  - plug in rendering & stats
  - spawn and update thousands of entities
- `scripts/` – helper scripts (e.g. `clean` to remove build artifacts)

---

## Architecture overview

At a high level, **thrix** is built around three concepts:

1. **ECS Core** – entities, components, and systems coordinated by a `World`.
2. **Plugins** – modular extensions that register resources, components, and systems.
3. **App Builder** – a fluent builder used to configure the world and assemble an application.

### 1. ECS Core

The core ECS lives under `engine/core` and related modules.

Key ideas:

- **Entities** are just numeric IDs.
- **Components** are classes that hold data (e.g. `Transform`, `Sprite`, game‑specific ones like `Bunny`).
- **Systems** are functions or classes that run over entities with specific component combinations.
- **World / SystemManager** coordinate:
  - which entities should be processed by which systems
  - component storage and lookup

To keep things efficient, the engine uses:

- `SparseSet` to store components per entity.
- `Bitset` (`engine/std/bitset.ts`) to represent component signatures for systems:

```typescript name=engine/std/bitset.ts url=https://github.com/mendesf/thrix-engine/blob/main/engine/std/bitset.ts
public matches(other: Bitset): boolean {
  for (let i = 0; i < this.buffer.length; i++) {
    const valueA = this.buffer[i];
    const valueB = other.buffer[i];
    if ((valueA & valueB) !== valueA) {
      return false;
    }
  }
  return true;
}
```

`matches` is used to quickly check if an entity’s component set satisfies a system’s required signature.

The `ComponentManager` wires this together:

```typescript name=engine/core/component-manager.ts url=https://github.com/mendesf/thrix-engine/blob/main/engine/core/component-manager.ts
constructor(registry: ComponentRegistry, maxEntities: number) {
  this.registry = registry;
  this.componentSets = new Array(this.registry.count);
  for (let i = 0; i < this.componentSets.length; i++) {
    this.componentSets[i] = new SparseSet<Component>(maxEntities);
  }
}

addComponent<T extends Component>(
  entity: number,
  instanceOrConstructor: T | ComponentConstructor<T>,
): T {
  const ctor = getConstructor(instanceOrConstructor);
  const index = this.registry.indexOf(ctor);
  const mutable = getInstance(instanceOrConstructor) as Mutable<T>;
  mutable.typeIndex = index;
  mutable.entity = entity;
  const instance = mutable as T;
  this.componentSets[index].set(entity, instance);
  return instance;
}
```

This is a classic **ECS data‑oriented design**: components are stored by type, entities are just indices, and systems operate on dense data.

### 2. Plugin system

The engine core exposes a `Plugin` base class and a `PluginBuilder`. Plugins are responsible for enriching the world with:

- resources (e.g. rendering context, RNG, assets)
- components (e.g. `Transform`, `Sprite`, `Text`)
- systems (e.g. rendering loop, stats collection)

Example: the **default plugin** registers common rendering-related pieces:

```typescript name=engine/default-plugin.ts url=https://github.com/mendesf/thrix-engine/blob/main/engine/default-plugin.ts
import { Sprite, Text, Transform } from "thrix/components";
import { Plugin, type PluginBuilder } from "thrix/core";
import { DisplayResource } from "thrix/resources";
import { AssetsResource } from "thrix/resources/assets-resource";
import { RngResource } from "thrix/resources/rng-resource.ts";

export class DefaultPlugin extends Plugin {
  async build(builder: PluginBuilder): Promise<void> {
    builder
      .addResource(DisplayResource)
      .addResource(AssetsResource)
      .addResource(RngResource)
      .registerComponent(Transform)
      .registerComponent(Sprite)
      .registerComponent(Text);
  }
}
```

Other plugins live under `plugins/`:

- `plugins/pixijs` – integration with PixiJS for rendering.
- `plugins/stats` – stats/debug overlays.
- `plugins/slot` – other experimental features.

Each plugin is built as a separate library with its own `vite.config.ts`, and they all alias the engine as `thrix`.

This is a deliberate **plugin-based architecture**: the core engine doesn’t know about rendering/details; plugins “plug in” features.

### 3. App builder

To tie everything together, the engine provides an `AppBuilder` (Builder pattern) in `engine/app.ts`:

```typescript name=engine/app.ts url=https://github.com/mendesf/thrix-engine/blob/main/engine/app.ts
export class AppBuilder extends PluginBuilder {
  private constructor(registry: WorldRegistry) {
    super(registry);
  }

  static create({ maxEntities = 1000 }: Options = {}): AppBuilder {
    const config = new WorldRegistry(maxEntities);
    return new AppBuilder(config);
  }

  registerComponent<T extends Component>(ctor: ComponentConstructor<T>): AppBuilder {
    return <AppBuilder>super.registerComponent(ctor);
  }

  addSystem<T extends SystemType>(
    schedule: SystemSchedule,
    ctor: T,
    ...components: Array<ComponentConstructor>
  ): AppBuilder {
    return <AppBuilder>super.addSystem(schedule, ctor, ...components);
  }

  addPlugin<T extends Plugin>(ctor: PluginType<T>): AppBuilder {
    return <AppBuilder>super.addPlugin(ctor);
  }

  build(): App {
    // configure system signatures, world, resources...
  }
}
```

The builder API is used from examples in a fluent way, e.g. in the `bunny` example:

```typescript name=examples/bunny/src/main.ts url=https://github.com/mendesf/thrix-engine/blob/main/examples/bunny/src/main.ts
import { PixiPlugin } from "plugins/pixijs";
import { StatsPlugin } from "plugins/stats";
import { AppBuilder, DefaultPlugin } from "thrix";
import { Startup, Update } from "thrix/core/system";
import { Bunny } from "./bunny";
import { BunnyCount } from "./bunny-count";
import { loadAsset, setupSpawner, spawnBunnies } from "./bunny-systems";
import { move } from "./movement-system";
import { rotate } from "./rotation-system";
import { Velocity } from "./velocity";
import { AngularVelocity } from "./angular-velocity";
import { Transform } from "thrix/components";

(async () => {
  const app = AppBuilder.create({ maxEntities: 10000 })
    .registerComponent(BunnyCount)
    .registerComponent(Bunny)
    .registerComponent(Velocity)
    .registerComponent(AngularVelocity)
    .addPlugin(DefaultPlugin)
    .addPlugin(PixiPlugin)
    .addPlugin(StatsPlugin)
    .addSystem(Startup, setupSpawner, BunnyCount)
    .addSystem(Startup, loadAsset)
    .addSystem(Update, spawnBunnies, BunnyCount, Bunny, Transform, Velocity)
    .addSystem(Update, move, Bunny, Transform, Velocity)
    .addSystem(Update, rotate, Bunny, Transform, AngularVelocity)
    .build();

  await app.init();
})();
```

This makes it easy to declare:

- which components exist,
- which plugins are enabled,
- which systems run on which schedule (e.g. `Startup`, `Update`),
- which component combinations each system operates on.

---

## Patterns and techniques used

The project intentionally explores several patterns:

- **Entity–Component–System (ECS) architecture**:
  - Entities are IDs, components are data, systems are behavior over sets of components.
  - Component storage uses `SparseSet` and `Bitset` for fast matching and iteration.

- **Plugin-based architecture**:
  - Core engine is small and generic.
  - Features like rendering and stats are implemented as plugins (`DefaultPlugin`, `PixiPlugin`, `StatsPlugin`).
  - Plugins register resources, components, and systems into the engine.

- **Builder pattern / fluent API**:
  - `AppBuilder` and `PluginBuilder` provide a fluent configuration API for composing worlds and apps.
  - Examples read like a small DSL for configuring a game.

- **Separation of core vs. examples**:
  - `engine/` is designed as a library (built with Vite as a lib).
  - `examples/` consume the engine and plugins, which keeps the core clean and reusable.

- **Browser‑friendly tooling**:
  - TypeScript for static typing.
  - Vite for building both the engine core and plugins as libraries.
  - Fast dev loop for browser‑based examples.

---

## Getting started

Install dependencies:

```bash
npm install
```

### Run the bunny example

```bash
npm run example bunny
```

This will:

- build the engine and plugins as needed,
- start the bunny scene in the browser (via Vite),
- spawn a large number of entities to test performance and API ergonomics.

> Check the `examples/bunny` folder for the full source of the example.

---

## Status

This project is experimental and under active development:

- APIs may change at any time.
- Performance and ergonomics are still being tuned.
- More examples and plugins are planned.