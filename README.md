
# Specific for opencode: Before any action, read:
- `./docs/CONSTITUTION.md`
- `.opencode/USER.md`
- Everything below `.opencode/`
- Available skills at `.opencode/skills/` (loaded automatically on demand)

---

# taulukko-common-scripts-dnd5ed

Common Scripts for Foundry VTT D&D 5e - TypeScript module with submodules, sockets and utilities for Foundry VTT.

- **Version:** 2.0.70
- **Author:** Edson Vicente Carli Junior
- **License:** MIT
- **Primary language:** TypeScript
- **Secondary language:** JavaScript (`*.mjs`) — only for pre-build scripts

---

## Stack and Versions

| Tool | Version |
|------------|--------|
| OpenCode | 1.4.3 |
| Node | v22.18.0 |
| npm | 10.9.3 |
| TypeScript | ^5.9.2 |

---

## Project Structure

```
scripts/
├── build.mjs                        # Pre-build: auto-increments patch version
├── config.json                      # Logging configuration (prefix, level)
├── package.json                     # Dependencies and npm scripts
├── tsconfig.json                    # TypeScript configuration (ES2022, strict)
├── jest.config.js                # Jest test configuration
├── vite.config.ts                   # Vite build (IIFE, terser, dts)
├── styles/
│   └── module.css                   # Module styles (hero points, socket, NPC)
├── templates/
│   └── npc-talk.hbs                 # NPC portrait Handlebars template
├── types/
│   └── foundry-api.d.ts             # Minimal Foundry API typings
├── dist/                            # Build output (IIFE bundle)
└── src/
    ├── global.d.ts                  # Foundry VTT global declarations
    ├── index.ts                     # Barrel exports (public library API)
    ├── module.ts                    # IIFE entry point (runtime bootstrap)
    ├── common-module.ts             # CommonModule - main orchestrator
    ├── common/
    │   ├── index.ts                 # Barrel: CacheReturnControl, SubModuleBase, ModuleBase
    │   ├── module-base.ts           # Abstract ModuleBase class
    │   ├── cache-returns-control.ts # Generic K,V cache with capacity
    │   └── script-helpers/
    │       └── url-fix.ts           # Utility to fix NPC image URLs
    ├── submodules/
    │   ├── index.ts                 # Barrel: all submodules
    │   ├── sub-module-base.ts       # Abstract SubModuleBase extends ModuleBase
    │   ├── npc/                     # NPC system (dialog, portrait, buttons)
    │   ├── dialog-utils/            # Foundry dialog factory
    │   ├── hero-points/             # Hero Points system (replaces Honor)
    │   ├── hide-unindentify/        # Hides item identification UI
    │   ├── flight-movement/         # Flight movement calculator (Pythagorean)
    │   ├── playertools/             # Player tools (placeholder)
    │   └── region-utils/            # Region visibility toggle
    ├── sockets/
    │   ├── index.ts                 # Barrel: Socket, DummySocket, ChatSocket, SocketLib
    │   ├── common-socket.ts         # Socket interface
    │   ├── common-socket-test.ts    # Socket test harness
    │   └── implementations/
    │       ├── common-socket-dummy.ts       # DummySocket (no-op)
    │       ├── common-socket-chatmessage.ts # ChatSocket (via ChatMessage flags)
    │       └── common-socket-socketlib.ts   # SocketLib (via foundryvtt-socketlib)
    └── tests/
        ├── sockets/
        │   └── implementations/
        │       ├── common-socket-chatmessage.test.ts  # ChatSocket tests (8 tests)
        │       ├── common-socket-context.test.ts      # Context stability tests (5 tests)
        │       └── common-socket-socketlib.test.ts   # SocketLib tests (10 tests)
        └── submodules/
            └── flight-movement/
                └── flight-movement-calc.test.ts       # Flight calculator tests (20 tests)
```

---

## Build and Execution

### npm Scripts

| Command | Description |
|---------|-----------|
| `npm run build` | Runs `build.mjs` (version increment) + `tsc` (TS compile) + `vite build` (IIFE bundle) |
| `npm run prepublishOnly` | Alias for `npm run build` |
| `npm test` | Runs unit tests via Jest (`npx jest`) |
| `npm run test:watch` | Runs tests in watch mode |
| `npm run test:coverage` | Runs tests with coverage |

### Build process

1. **`build.mjs`** (JavaScript pre-build) — Automatically increments the patch version in `package.json`
2. **`tsc`** — Compiles TypeScript to JavaScript
3. **`vite build`** — Packages as IIFE with global name `CommonScripts`, generates `.d.ts` via `vite-plugin-dts`, minifies with `terser`

### Output

- `dist/taulukko-common-scripts-dnd5ed.iife.js` — Main bundle loaded by Foundry
- `dist/index.d.ts` — Typings for consumption as npm dependency

---

## Dependencies

| Package | Version | Description |
|--------|--------|-----------|
| `taulukko-commons` | ^1.3.0 | Internal library: `Log`, `LogGenericImpl`, `injectController`, `Level` |
| `typescript` | ^5.9.2 | TypeScript compiler (dev) |
| `vite` | ^7.3.0 | Bundler (dev) |
| `vite-plugin-dts` | ^4.5.4 | `.d.ts` generation (dev) |
| `terser` | ^5.46.1 | JS minifier (dev) |
| `jest` | ^30.3.0 | Unit testing framework (dev) |

---

## Configuration

### `config.json`

Logging configuration loaded at runtime by `CommonModule`:

```json
{
  "log": {
    "format": "",
    "prefix": "CS",
    "hasDate": true,
    "hasLevel": true,
    "level": "INFO"
  }
}
```

| Field | Description | Values |
|-------|-----------|--------|
| `log.format` | Custom message format | String |
| `log.prefix` | Log message prefix | String (e.g., `"CS"`) |
| `log.hasDate` | Display date/time in logs | `true` / `false` |
| `log.hasLevel` | Display level in logs | `true` / `false` |
| `log.level` | Minimum log level | `"DEBUG"`, `"INFO"`, `"WARN"`, `"ERROR"` |

---

## Architecture

### Main patterns

1. **Dependency Injection** — Uses `injectController` from `taulukko-commons` for singleton resolution by name or class
2. **Lifecycle via Hooks** — All modules follow `initHooks()` → `waitReady()` → ready, chained via Foundry's `Hooks`
3. **Async Polling** — `whaitFor()` for waiting on module dependencies (5 min timeout)
4. **Strategy Pattern (Sockets)** — `Socket` interface with 3 interchangeable implementations
5. **IIFE Bundle** — Single script loaded by Foundry, exposes `window.TaulukkoCommon` and `window.CommonScripts`

### Pattern: Auto-Reference in Singletons

When a Singleton class needs to reference itself, it should **not** use `injectController.resolve("ClassName")`, as this causes circular dependency.

#### Solution:

1. **Instance global variable** at the top of the file:
    ```typescript
    let myClass: MyClass | undefined = undefined;
    ```

2. **Assignment in constructor**:
    ```typescript
    constructor() {
      super();
      myClass = this; // Self-assignment
    }
    ```

3. **Use the global variable** instead of resolve:
    ```typescript
    const instance: MyClass = myClass as MyClass;
    ```

#### Classes that follow this pattern:

| Class | File |
|--------|---------|
| `PlayersTools` | `src/submodules/playertools/players-tool.ts` |
| `HeroPoints` | `src/submodules/hero-points/hero-points.ts` |
| `RegionUtils` | `src/submodules/region-utils/region-utils.ts` |
| `NPCDialog` | `src/submodules/npc/npc-dialog.ts` |
| `HideUnidentify` | `src/submodules/hide-unindentify/hide-unidentify.ts` |
| `FlightMovement` | `src/submodules/flight-movement/flight-movement.ts` |

For more details, see `docs/spec/inject-controller-audit-spec.md` and `docs/spec/auto-injection-fix-spec.md`.

### Entry Points

#### `src/module.ts` — IIFE Bootstrap

Main runtime entry point:
- Creates instance of `CommonModule`
- Registers globals on `window.TaulukkoCommon`: NPC, NPCDialog, DialogUtils, FlightMovement, ModuleBase, SubModuleBase, LogGenericImpl, injectController, Level
- Loads `config.json` for logging configuration
- Registers DI singletons: `"FoundryDocument"`, `"CommonModule"`, `"CommonLogguer"`
- Calls `commonModule.init()`

#### `src/index.ts` — Barrel exports

Exports the entire public API of the library for consumption as npm dependency.

#### `src/common-module.ts` — Main orchestrator

- Module name: `"common-scripts-dnd5ed"`, version: `"1.0.6"`
- `initHooks()`: Loads all submodules, creates DummySocket, registers Foundry hooks `"init"` and `"ready"`
- `waitReady()`: Waits for hooks to load, triggers `"onReadyCommonModule"` hook
- Hook `"init"`: Registers settings
- Hook `"ready"`: Checks GM, adds CSS class `isGM`, handles version migration, creates help "?" button linked to "How to Roll Dice" journal

---

## Common Layer (`src/common/`)

### `module-base.ts` — ModuleBase (abstract)

Base class for all modules:
- `init()`: calls `initHooks()` then `waitReady()`, sets `#ready = true`
- `whaitFor(test, timeout, sleep)`: async waiting utility based on polling
- Abstract methods: `initHooks()`, `waitReady()`

### `igame-context.ts` — IGameContext (interface)

Interface for typing the Foundry VTT `game` object:
- `name`, `user`, `users`, `scenes`, `actors`, `modules`, `socket`, `settings`, `journal`, `keybindings`
- Sub-interfaces: `IGameSettings`, `IGameJournalSheet`, `IGameJournalEntry`, `IGameJournal`

Used to type the `"GameContext"` registration in the DI container (via `game as unknown as IGameContext`).

**File:** `src/common/igame-context.ts`

---

### `cache-returns-control.ts` — CacheReturnControl<K, V>

Generic cache with configurable capacity (default 1000):
- Dual maps: `_cache` (index → value) and `_indexKey` (key → index)
- FIFO eviction when capacity exceeded
- Lazy cleanup when index map exceeds 2x capacity

### `script-helpers/url-fix.ts` — URL fix utility

Standalone script (not imported by default):
- When `FIX_NPCs = true`, bulk updates NPC actor image URLs to new base path
- Preserves original filenames

---

### `ifoundry-api.ts` — IFoundryAPI (interface)

Interface for abstracting the Foundry VTT API:
- `hooks`: object with `on`, `once`, `callAll` methods for hook manipulation
- `createChatMessage(payload)`: method to create chat messages

Allows dependency injection and mocking in tests.

**File:** `src/common/ifoundry-api.ts`

---

### `foundry-api.ts` — FoundryAPI (implementation)

Concrete implementation of IFoundryAPI:
- Abstraction over Foundry VTT global API (`Hooks`, `game`, etc.)
- **DI Registration:** `"FoundryAPI"` via `injectController.registerByName()` in `module.ts:69`
- **Dependency:** Requires `game` to be available (Foundry VTT runtime)

```typescript
const foundryApi = injectController.resolve<IFoundryAPI>("FoundryAPI");
foundryApi.hooks.on("init", () => console.log("Init!"));
```

**File:** `src/common/foundry-api.ts`

---

## Submodules (`src/submodules/`)

### `sub-module-base.ts` — SubModuleBase (abstract)

Extends `ModuleBase`, serves as type marker for submodules.

---

### NPC System (`npc/`)

Complete NPC dialog system.

#### `npc/button.ts` — Button

Dialog button class:
- Properties: `action`, `label`, `defaultValue`, `type` ("screen"/"action"/"screen-context"), `callback`

#### `npc/npc.ts` — NPC (abstract)

Base class for NPCs:
- Properties: `name`, `imageUrl`, `formatSound`, `groups` (Set), `screens` (Array)
- Abstract methods: `groupToLines`, `lines`
- `init()`: waits for NPCDialog and DialogUtils via DI, pushes initial screen
- `createDialog()`: creates dropdown with options + Send/Back/Cancel buttons
- `speak(lineIndex)`: sends NPC portrait event via ChatMessage flags (`npc-talk`), plays audio from `modules/forgotten-realms/sounds/npcs/{name}/{index}/`
- `send()`: resolves group combinations to select random line, calls `speak()`, navigates screens
- `getCombinations()`: generates group key combinations (separated by `;`)

#### `npc/npc-dialog.ts` — NPCDialog (SubModuleBase)

Manages NPC selection UI and scene control buttons:
- `initHooks()`: listens to `createChatMessage` (renders NPC portrait on flag `npc-talk`) and `getSceneControlButtons` (adds NPC button for GM)
- `showNPCChooseDialog()`: creates dialog with one button per registered NPC
- `callNPC(npc)`: sets selected NPC and starts its screen

#### `npc/npc-portrait-dialog.ts` — NPCPortraitDialog (Application)

Foundry application for full-screen NPC portrait overlay:
- Template: `modules/common-scripts-dnd5ed/scripts/templates/npc-talk.hbs`
- `renderTalk(data)`: static factory to instantiate and render
- `showToAllPlayers()`: renders locally + emits socket to remote players

---

### Dialog Utils (`dialog-utils/dialog-utils.ts`) — DialogUtils (SubModuleBase)

Foundry dialog factory:
- `createButton()`: factory for `Button` objects
- `createDialog(title, style, content, buttons, submit, left, top, width, height)`: wrapper for `foundry.applications.api.DialogV2` with custom content/style injection

---

### Hero Points (`hero-points/hero-points.ts`) — HeroPoints (SubModuleBase)

Replaces D&D 5e's "Honor" ability score with a custom "Hero Points" system:
- `initializeHabilityHero()`: hook on `renderDocumentSheetV2`
- For NPC sheets: removes the `hon` div completely
- For character sheets: replaces HTML with custom "hero" label + increment/decrement operators
- `addEditButtonsToHeroPoints()`: +/- buttons only for GM (+ adds 1, - divides by 2 and rounds)
- `createDialog()`: clicking the "hero" label displays an explanatory dialog about Hero Points rules

---

### Hide Unidentify (`hide-unindentify/hide-unidentify.ts`) — HideUnidentify (SubModuleBase)

Hides item identification UI for non-GM players:
- `initHooks()`: hooks on `renderItemSheet5e` and `dnd5e.getItemContextOptions`
- `removeButtonsFromItemContext()`: removes "Identify" and "Attune" options from context menu for unidentified items
- `removeItemSheetIdentifyInformations()`: removes editable subtitle labels and toggle-identified elements from item sheets

---

### Players Tools (`playertools/players-tool.ts`) — PlayersTools (SubModuleBase)

Placeholder for player tools:
- `initializeFlyMeasure()`: registered but not implemented (log only)
- Waits for CommonModule to be ready before initializing

---

### Region Utils (`region-utils/region-utils.ts`) — RegionUtils (SubModuleBase)

Region visibility toggle:
- `registerKeybindings()`: registers `Shift+G` shortcut (GM only) to toggle visibility
- `toggleVisibilityRegions()`: iterates all regions of the current scene and toggles `visibility`
- `stop(event)`: utility to snap token to center of a region shape

---

### Flight Movement (`flight-movement/`) — FlightMovement (SubModuleBase)

Flight movement calculator based on Pythagorean Theorem (D&D 5e).

Adds a button in **Token Controls** visible to **all players** (does not require GM). When clicked, opens a dialog with 3 numeric fields:

- **X Axis** — Horizontal movement (feet)
- **Y Axis** — Vertical movement (feet)
- **Hypotenuse** — Total flight movement (feet)

The user fills in 2 of the 3 fields and clicks "Calculate". The third field is calculated automatically via `a² + b² = c²`. All values must be >= 0.

#### Files

| File | Description |
|---------|-----------|
| `flight-movement/flight-movement.ts` | `FlightMovement` class — `getSceneControlButtons` hook, button and dialog |
| `flight-movement/flight-movement-calc.ts` | Pure functions: `calcHypotenuse(x, y)` and `calcCathetus(hypotenuse, otherCathetus)` |
| `flight-movement/index.ts` | Barrel export |

#### Calculation functions (`flight-movement-calc.ts`)

| Function | Parameters | Return |
|--------|-----------|--------|
| `calcHypotenuse(x, y)` | Catheti X and Y (>= 0) | Hypotenuse rounded to 2 decimal places |
| `calcCathetus(hypotenuse, otherCathetus)` | Hypotenuse and known cathetus (>= 0) | Calculated cathetus rounded to 2 decimal places |

Negative values return 0. Hypotenuse less than cathetus returns 0 (impossible triangle).

#### Tests

20 unit tests via Jest in `src/tests/submodules/flight-movement/flight-movement-calc.test.ts`:
- Classic Pythagorean triangles (3-4-5, 5-12-13)
- Zero values
- Negative values
- Decimals and rounding
- Impossible triangle (hypotenuse < cathetus)
- Typical D&D 5e values (30ft, 60ft)

### Socket Tests

Unit tests via Jest in `src/tests/sockets/implementations/`:

**common-socket-socketlib.test.ts:**
- `getNonGMUserIds`: returns only non-GM user IDs, handles cases with no users or only GMs (3 tests)
- `executeAsGM`: GM validation, send only to non-GMs with flag `onlyPlayers: true`, multiple arguments, return propagation (8 tests)
- Total: 11 tests

**common-socket-chatmessage.test.ts (new):**
- `executeAsGM` with flag `onlyPlayers`: GM validation, verify `sendMessage` with correct parameters
- Consistency between SocketLib and ChatSocket regarding `onlyPlayers` mechanism
- `isReadyToSendToGM`: validation based on `game.user.isGM`
- Callback registration
- Total: 8 tests

**common-socket-context.test.ts:**
- Context stability (`this`) for detached methods: `executeForAll`, `executeAsGM`, `executeToGM`, `executeIn`, `register`
- Total: 5 tests

**Total socket tests: 24 tests**

**Grand total: 51 tests** — Run with `npm test`

---

### Dependency Injection Audit Tests

Dependency injection audit tests via Jest in `src/tests/dependency-injection/`:

**audit.test.ts:**
- Verifies that all names resolved via `injectController.resolve()` are registered in the container
- Validates registrations: `GameContext`, `FoundryAPI`, `CommonLogguer`, `CommonModule`, `Socket`, `ReturnsControl`
- Total: 7 tests

**Setup:** `src/tests/setup-jest.ts` — Populates DI container with mocks representing runtime registrations:
- `CommonModule`, `CommonLogguer`, `GameContext`, `FoundryAPI`, `Socket`, `ReturnsControl`
- Allows unit testing without depending on Foundry VTT

---

## Sockets (`src/sockets/`)

### `common-socket.ts` — Socket Interface

Methods: `isReady()`, `executeToGM()`, `executeAsGM()`, `executeForAll()`, `executeIn()`, `register()`, `isReadyToSendToGM()`

Constant: `CALLBACK_FUNCTION_EVENT_NAME = "onReadyCommonSocket"`

### Implementations

| Implementation | File | Description |
|---------------|---------|-----------|
| **DummySocket** | `common-socket-dummy.ts` | No-op, currently used in production. Triggers `"onReadyCommonSocket"` hook |
| **ChatSocket** | `common-socket-chatmessage.ts` | Communication via Foundry ChatMessage flags. Supports broadcast, GM-only, player-only, targeted. Request/response via `CacheReturnControl` |
| **SocketLib** | `common-socket-socketlib.ts` | Wrapper for `foundryvtt-socketlib` module. Expects `"onReadyCommonModule"` and `"socketlib.ready"` hooks |

### `common-socket-test.ts` — Test harness

Registers test functions (`showMessage`, `add`) and exercises `executeForAll`, `executeAsGM`, `executeToGM`, `executeIn`.

---

## Styles (`styles/module.css`)

- Dice help button: `writing-mode: vertical-lr`
- `.socket-chat-event { display: none }` — hides socket messages in chat
- Hero Points styling: `drop-shadow`, `text-transform: uppercase`, cursor pointer, +/- buttons
- Dialog positioning

---

## Templates (`templates/`)

### `npc-talk.hbs`

Handlebars template for NPC portrait: image + name + dialog text.

---

## Exposed Globals

The IIFE bundle exposes two globals on `window`:

### `window.TaulukkoCommon`

| Property | Type |
|-------------|------|
| `NPC` | Abstract NPC class |
| `NPCDialog` | NPCDialog instance |
| `DialogUtils` | DialogUtils instance |
| `FlightMovement` | FlightMovement instance |
| `ModuleBase` | Abstract ModuleBase class |
| `SubModuleBase` | Abstract SubModuleBase class |
| `LogGenericImpl` | Log implementation (taulukko-commons) |
| `injectController` | Dependency injection controller |
| `Level` | Log level enum |

### `window.CommonScripts`

All exports from the barrel `src/index.ts`.

---

## How to Use

### NPC System — Complete Tutorial

The NPC system allows creating non-player characters with contextual dialogs. Each NPC has dialog lines organized in groups, and the system randomly selects a line based on active groups.

#### 1. File Structure

Each NPC must have at least 2 files:
- `{name}.ts` — NPC class extends NPC
- `{name}-lines.ts` — Dialog lines and group mapping

#### 2. Defining Dialog Lines

In the `{name}-lines.ts` file:

```typescript
// Dialog lines indexed by ID
export const npcLines: any = {
  1: "First dialog line",
  2: "Second dialog line",
  3: "Third dialog line",
  // ... more lines
};

// Group to lines mapping (separated by semicolon)
export const npcGroupToLines: Map<string, string> = new Map([
  ["1", "1"],                    // Group 1 uses line 1
  ["2", "2;3;4"],                // Group 2 uses lines 2, 3 or 4
  ["1;2", "5;6"],                // Groups 1 AND 2 together use lines 5 or 6
  ["999", "100;101;102"],        // Special group for random
]);

// Group constants
export const npcGroups = {
  GROUP_1: "1",
  GROUP_2: "2",
  COMBAT_GROUP: "3",
  EXPLORATION_GROUP: "4",
  RANDOM: "999"                  // Required for random responses
} as const;
```

#### 3. Creating the NPC Class

```typescript
import { joaoLines, joaoGroupToLines, joaoGroups } from "./joao-lines";
import { DialogUtils, NPC, NPCDialog } from "taulukko-common-scripts-dnd5ed";
import { injectController, Log } from "taulukko-commons";

export class JoaoNinguem extends NPC {
  // Optional: custom CSS for dialogs
  readonly DEFAULT_STYLE: string = `
    <style>
      .select-action { padding: 20px; background: #222; color: #eee; }
      .select-action button { margin: 5px; padding: 5px 10px; }
    </style>
  `;

  // Required mappings
  groupToLines: Map<string, string> = joaoGroupToLines;
  lines: any = joaoLines;

  constructor() {
    // super(name, imageURL, soundFormat)
    // Default format: "ogg". To use MP3, pass "mp3" as third parameter
    super("JoaoNinguem", "modules/my-module/images/npcs/joao.webp", "mp3");
  }

  // Initialization — registers the NPC in the system
  public async init() {
    const npcDialog = injectController.resolve<NPCDialog>("NPCDialog");
    npcDialog.npcSelected = this;

    if (!npcDialog.npcs) {
      npcDialog.npcs = new Map();
    }

    // Register with unique key
    npcDialog.npcs.set("joao", this);
  }

  // Initial screen — main action menu
  public async startScreen() {
    const npcDialog = injectController.resolve<NPCDialog>("NPCDialog");
    const dialogUtils: DialogUtils = injectController.resolve("DialogUtils");

    // Add initial screen for navigation
    npcDialog.npcSelected.screens.push({ 
      name: "start-screen", 
      callback: npcDialog.npcSelected.startScreen, 
      type: "screen" 
    });

    const title = "Joao Ninguem: Choose what to do";
    const content = `<div class="select-action"><H1>Choose an action:</H1>`;

    // Create action buttons
    const buttons = [
      // THE BUTTON TYPE defines the behavior, NOT the callback function:
      // - "screen": opens new screen, DOES NOT add group when sending
      // - "action": executes and exits, adds group when sending
      // - "screen-context": opens new screen AND adds group when sending
      
      // This button is type "screen-context" — leads to new screen AND combines groups
      dialogUtils.createButton(
        "joao-finding-someone", 
        "Finding Someone", 
        true, 
        "screen-context",    // <-- TYPE DEFINES BEHAVIOR
        async () => npcDialog.npcSelected.findSomeone()  // Callback executed after sending
      ),

      // This button is type "action" — executes and exits immediately
      dialogUtils.createButton(
        "joao-overweight", 
        "Overweight", 
        true, 
        "action",            // <-- TYPE DEFINES BEHAVIOR
        async () => npcDialog.npcSelected.overWeight()  // Callback executed after sending
      ),
    ];

    // Create dialog with navigation dropdown + buttons
    npcDialog.npcSelected.createDialog(title, content, buttons);
  }

  // Function called when "Finding Someone" (screen-context) button is selected
  // Note: group logic was already added by the button type BEFORE calling this function
  public async findSomeone() {
    const npcDialog = injectController.resolve<NPCDialog>("NPCDialog");
    const dialogUtils: DialogUtils = injectController.resolve("DialogUtils");

    const title = "Joao Ninguem: Finding someone";
    const content = `<div class="select-action"><H1>Choose an action:</H1>`;

    const buttons = [
      dialogUtils.createButton(
        "joao-seeing-familiar",
        "Seeing a familiar face",
        true,
        "action",    // Now uses action — executes and exits
        async () => npcDialog.npcSelected.seeingSomeoneFamiliar()
      ),
    ];

    npcDialog.npcSelected.createDialog(title, content, buttons);
  }

  // Function called when action button is pressed on findSomeone screen
  // The group was already added by the button type
  public async overWeight() {
    const npcDialog = injectController.resolve<NPCDialog>("NPCDialog");
    // The joaoGroups.OVERWEIGHT group was already added by the action-type button
    // Just call send() to select and reproduce the line
    await npcDialog.npcSelected.send();
  }

  // Function called when action button is pressed on findSomeone screen
  // The group was already added by the button type
  public async seeingSomeoneFamiliar() {
    const npcDialog = injectController.resolve<NPCDialog>("NPCDialog");
    // The group was already added by the button type
    await npcDialog.npcSelected.send();
  }
}
```

#### 4. Button Types (IMPORTANT: behavior is defined by type, not function)

| Type | When to use | What happens |
|------|-------------|----------------|
| `"screen"` | To navigate between screens without changing dialog context | Opens new screen, **does not add** group when sending |
| `"action"` | To execute an action and exit the dialog | Executes callback, **adds** group, calls send() automatically |
| `"screen-context"` | To create submenus that combine with current context | Opens new screen, **adds** group when sending |

**Main differences:**
- `action` = executes AND exits dialog (adds group)
- `screen` or `screen-context` = opens new screen within dialog (only screen-context adds group)

#### Choice Menu (Dropdown)

The `createDialog()` automatically creates a **dropdown SELECT** with:
- One "Random given context so far" option (selected by default)
- One option for each button created

When the user clicks **"Send"**, the system executes the selected dropdown option, not the button directly. This allows:
1. Using buttons only as visual menu
2. Choosing specific action in dropdown before sending
3. Choosing "Random" to select a random line based on active groups

#### 5. Groups and Combinations System

The system allows combining multiple groups to generate contextual dialogs:

```typescript
// Add multiple groups
npcDialog.npcSelected.groups.add(joaoGroups.ENTER_IN_BATTLE);  // "2"
npcDialog.npcSelected.groups.add(joaoGroups.GETTING_HURT);     // "3"

// The system will look for keys:
// "2;3" (exact combination)
// "2" and "3" (individual)
```

#### 6. Audio

**Default Format:** OGG (ogg)

**NPC Constructor:**
```typescript
// Default format (ogg) — no need to pass third parameter
super("NPCName", "path/image.webp");

// Different format (mp3) — pass the format as third parameter
super("NPCName", "path/image.webp", "mp3");
```

**Audio file structure:**
```
modules/{module}/sounds/npcs/{npcName}/{index}/{npcName}{index}.{format}
```

Example (default ogg format):
```
modules/forgotten-realms/sounds/npcs/joao/001/joao001.ogg
```

Example (mp3 format):
```
modules/my-module/sounds/npcs/joao/001/joao001.mp3
```

**Note:** Index must be zero-padded to 3 digits (001, 002, etc.)

#### 7. Registration in Module

In your module's `module.ts` file:

```typescript
// Import your NPC
import { JoaoNinguem } from "./src/joao";

// Create instance and initialize
const joao = new JoaoNinguem();
await joao.init();
```

#### Complete Example: Dynamic Callback

When you need to pass a dynamic group to the callback (instead of using button type):

```typescript
// Function that creates a callback that adds group and sends
public createcallbackSend(group: number) {
  return async () => {
    const npcDialog = injectController.resolve<NPCDialog>("NPCDialog");
    npcDialog.npcSelected.groups.add(group);
    return npcDialog.npcSelected.send();
  };
}

// Usage with action button
const callback: any = npcDialog.npcSelected.createcallbackSend;

const buttons = [
  dialogUtils.createButton("joao-exhausted", "Exhausted / Sleepy", true, "action", callback(joaoGroups.EXHAUSTED_AND_SLEEPY)),
  dialogUtils.createButton("joao-weight", "Overweight", true, "action", callback(joaoGroups.EXCESS_WEIGHT)),
];
```

---

### Dialog Utils

#### Creating Buttons

```typescript
const dialogUtils: DialogUtils = injectController.resolve("DialogUtils");

const button = dialogUtils.createButton(
  "action-id",        // Unique identifier
  "Button Label",     // Displayed text
  true,               // Is default?
  "action",           // Type: "screen", "action", "screen-context"
  async () => {       // Callback
    console.log("Button clicked!");
  }
);
```

#### Creating Dialogs

```typescript
dialogUtils.createDialog(
  "Dialog Title",
  "DEFAULT_STYLE or custom CSS",
  "HTML Content",
  [button1, button2],
  submit,             // Submit function (optional)
  200,                // X position (optional)
  undefined,          // Y position (optional)
  400                 // Width (optional)
);
```

---

## OpenCode Skills

Skills are reusable instructions that OpenCode loads on demand to execute specific project tasks. They reside in `.opencode/skills/<name>/SKILL.md`.

**How to use:** OpenCode detects skills automatically. It can load them when needed or you can request explicitly (e.g., "use the readme-sync-enforcer skill").

### readme-sync-enforcer

Checks if all `.ts` and `.mjs` scripts and project configurations are documented in this README and if the documentation reflects the current code behavior.

**When to use:** After creating or modifying scripts, at CODE_REVIEWER or DOCUMENTATION_WRITER stage of the agent flow.
