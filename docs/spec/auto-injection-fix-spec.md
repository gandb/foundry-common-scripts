# Spec: Fix Auto-Injection in Singletons

## Objective

Identify and fix all Singleton classes that try to resolve themselves through `injectController.resolve()`, creating a reusable exception. Replace with instance global variable, remove unnecessary `waitFor`.

## Identified Classes with Self-Reference

| Class | File | Lines with self-resolve |
|--------|---------|-------------------------|
| PlayersTools | `src/submodules/playertools/players-tool.ts` | 12, 23, 24 |
| HeroPoints | `src/submodules/hero-points/hero-points.ts` | 34, 245, 311 |
| RegionUtils | `src/submodules/region-utils/region-utils.ts` | 21, 109 |
| NPCDialog | `src/submodules/npc/npc-dialog.ts` | 41, 70, 79, 106, 147, 181 |
| HideUnidentify | `src/submodules/hide-unindentify/hide-unidentify.ts` | 23, 32 |
| FlightMovement | `src/submodules/flight-movement/flight-movement.ts` | 24, 34, 41, 63 |

## Correction Pattern

For each identified class, implement:

### 1. Instance Global Variable
```typescript
// At the top of the file, outside the class
let playersTools: PlayersTools | undefined = undefined;
```

### 2. Assignment in Constructor
```typescript
export class PlayersTools extends SubModuleBase {
  constructor() {
    super();
    playersTools = this; // Self-assignment
  }
  // ... rest of code
}
```

### 3. Replace injectController.resolve("ClassName")
```typescript
// Before (problem)
const playerTools: PlayersTools = injectController.resolve("PlayersTools");

// After (solution) — checks injectController first, then uses global variable
const playerTools: PlayersTools = 
  (injectController.has("PlayersTools") ? injectController.resolve("PlayersTools") : playersTools) as PlayersTools;
```

**Note:** This pattern allows tests to continue working with dependency injection, while production code uses the global variable when there's no container registration.

### 4. Remove unnecessary waitFor
In `initHooks()` or `waitReady()` methods, where the class waits for itself via `whaitFor()`, remove that wait since the global variable is already available.

## Files to be modified

1. `src/submodules/playertools/players-tool.ts`
2. `src/submodules/hero-points/hero-points.ts`
3. `src/submodules/region-utils/region-utils.ts`
4. `src/submodules/npc/npc-dialog.ts`
5. `src/submodules/hide-unindentify/hide-unidentify.ts`
6. `src/submodules/flight-movement/flight-movement.ts`

## Expected tests

1. All existing tests (`npm test`) must continue passing
2. The `audit.test.ts` test must continue validating that resolved names are registered
3. Verify classes work correctly after changes

## Documentation Update

The specification for implementing this pattern should be documented in `docs/spec/inject-controller-audit-spec.md` (or create new section) so DEVELOPER and DOCUMENTATION_WRITER know how to work with this pattern in the future.

### Section to add in inject-controller-audit-spec.md:

```markdown
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
```

## Acceptance Criteria

1. ✅ Complete audit — all 6 classes identified
2. ✅ Pattern implemented — global variable, assignment in constructor, remove waitFor
3. ✅ Consistency verified — same changes across all classes
4. ✅ No regressions — tests passing after changes
5. ✅ Minimal documentation in code — explanatory comments
6. ✅ Pattern documented in `docs/spec/inject-controller-audit-spec.md`
