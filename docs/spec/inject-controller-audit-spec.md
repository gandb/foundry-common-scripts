# Spec: injectController.resolve Audit

## Objective

Audit all usages of `injectController.resolve` in the project to ensure the object exists in the container at the point where it's resolved. If it doesn't exist, it's a BUG in the code — must be fixed, not handled with fallback.

## Main Rule
- If it was coded to fetch from inject controller, the object **MUST** exist at that point
- `injectController.has()` should only be used when there's a **prepared fallback** (e.g., optional object)
- If it doesn't exist and there's no fallback, **fix the code** (the object should have been registered before)

## Files to modify
- All `.ts` files in `src/` that contain `injectController.resolve` without prior verification

## Procedure

### 1. Map all usages
Search for all `injectController.resolve` in the project (~159 occurrences)

### 2. Categorize each usage
- **Has guarantee:** The object is registered before this point in execution flow → OK, no change needed
- **Has fallback:** Code handles non-existent object with fallback → OK, but document the fallback
- **No fallback:** If the object doesn't exist, it's a bug → **FIX** (register the object or adjust the flow)

### 3. Fix problematic cases
For usages without fallback where the object should exist:
- Verify if the object is being registered correctly in the container
- If not, add registration in the appropriate location (e.g., module.ts, common-module.ts)
- If registered but at wrong time, adjust registration order

## Reference Pattern
- `npc-dialog.ts` lines 110-120: Example of verification with fallback
- `flight-movement.ts` lines 67-71: Example of verification with fallback

## Pattern: Auto-Reference in Singletons

When a Singleton class needs to reference itself:

### Don't do:
```typescript
const myClass: MyClass = injectController.resolve("MyClass");
```

### Do:
1. Create instance global variable at the top of the file:
    ```typescript
    let myClass: MyClass | undefined = undefined;
    ```
2. Assign in constructor:
    ```typescript
    constructor() {
      super();
      myClass = this;
    }
    ```
3. Use the global variable instead of resolve:
    ```typescript
    const instance: MyClass = myClass as MyClass;
    ```

### When to use:
- Classes that are Singletons registered via `injectController.registerByClass()`
- Classes that need to reference themselves in methods like `initHooks()` or `waitReady()`
- Don't use for external dependencies (CommonLogguer, CommonModule, etc)

### Classes that follow this pattern:
- `PlayersTools` (`src/submodules/playertools/players-tool.ts`)
- `HeroPoints` (`src/submodules/hero-points/hero-points.ts`)
- `RegionUtils` (`src/submodules/region-utils/region-utils.ts`)
- `NPCDialog` (`src/submodules/npc/npc-dialog.ts`)
- `HideUnidentify` (`src/submodules/hide-unindentify/hide-unidentify.ts`)
- `FlightMovement` (`src/submodules/flight-movement/flight-movement.ts`)

## Expected tests
1. All existing tests (`npm test`) must continue passing
2. No regressions in existing functionality
