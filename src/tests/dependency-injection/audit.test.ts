import { injectController } from "taulukko-commons";

interface RegistryEntry {
  name: string;
  file: string;
  line: number;
}

interface ResolveEntry {
  name: string;
  file: string;
  line: number;
}

const registryPatterns: { pattern: RegExp; file: string }[] = [
  {
    pattern: /injectController\.registerByName\("([^"]+)"/g,
    file: "module.ts",
  },
  {
    pattern: /injectController\.registerByName\("([^"]+)"/g,
    file: "common-module.ts",
  },
  {
    pattern: /injectController\.registerByName\("([^"]+)"/g,
    file: "common-socket-socketlib.ts",
  },
  {
    pattern: /injectController\.registerByName\("([^"]+)"/g,
    file: "common-socket-chatmessage.ts",
  },
  {
    pattern: /injectController\.registerByName\("npc:"/g,
    file: "npc-dialog.ts",
  },
];

const resolvePatterns: { pattern: RegExp; file: string }[] = [
  { pattern: /injectController\.resolve\("([^"]+)"/g, file: "module.ts" },
  {
    pattern: /injectController\.resolve\("([^"]+)"/g,
    file: "common-module.ts",
  },
  {
    pattern: /injectController\.resolve\("([^"]+)"/g,
    file: "common-socket-socketlib.ts",
  },
  {
    pattern: /injectController\.resolve\("([^"]+)"/g,
    file: "common-socket-chatmessage.ts",
  },
  { pattern: /injectController\.resolve\("([^"]+)"/g, file: "npc-dialog.ts" },
  { pattern: /injectController\.resolve\("([^"]+)"/g, file: "hero-points.ts" },
  { pattern: /injectController\.resolve\("([^"]+)"/g, file: "region-utils.ts" },
  {
    pattern: /injectController\.resolve\("([^"]+)"/g,
    file: "flight-movement.ts",
  },
  { pattern: /injectController\.resolve\("([^"]+)"/g, file: "dialog-utils.ts" },
];

describe("Dependency Injection Audit", () => {
  const registeredNames = new Set<string>();
  const resolvedNames = new Set<string>();

  beforeAll(() => {
    registeredNames.add("FoundryDocument");
    registeredNames.add("CommonModule");
    registeredNames.add("CommonLogguer");
    registeredNames.add("Socket");
    registeredNames.add(RETURN_CONTROL_NAME);
    registeredNames.add("GameContext");
    registeredNames.add("FoundryAPI");

    resolvedNames.add("CommonLogguer");
    resolvedNames.add("CommonModule");
    resolvedNames.add("FoundryAPI");
    resolvedNames.add("Socket");
    resolvedNames.add("GameContext");
    resolvedNames.add(RETURN_CONTROL_NAME);
  });

  it("should have all resolved names registered in container", () => {
    const unregistered: string[] = [];

    for (const name of resolvedNames) {
      if (!injectController.has(name)) {
        unregistered.push(name);
      }
    }

    expect(unregistered).toEqual([]);
  });

  it("should verify GameContext is registered before use", () => {
    const hasGameContext = injectController.has("GameContext");
    expect(hasGameContext).toBe(true);
  });

  it("should verify FoundryAPI is registered before use", () => {
    const hasFoundryAPI = injectController.has("FoundryAPI");
    expect(hasFoundryAPI).toBe(true);
  });

  it("should verify CommonLogguer is registered", () => {
    const hasCommonLogguer = injectController.has("CommonLogguer");
    expect(hasCommonLogguer).toBe(true);
  });

  it("should verify CommonModule is registered", () => {
    const hasCommonModule = injectController.has("CommonModule");
    expect(hasCommonModule).toBe(true);
  });

  it("should verify Socket is registered", () => {
    const hasSocket = injectController.has("Socket");
    expect(hasSocket).toBe(true);
  });

  it("should verify ReturnsControl is registered", () => {
    const hasReturnControl = injectController.has(RETURN_CONTROL_NAME);
    expect(hasReturnControl).toBe(true);
  });
});

const RETURN_CONTROL_NAME = "ReturnsControl";
