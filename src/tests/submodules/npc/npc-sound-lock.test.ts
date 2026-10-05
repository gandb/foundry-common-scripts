// NPC stability tests — R3: per-NPC sound lock (5s window).
// Covers: first sound plays; second one from the SAME NPC within 5s is blocked;
// test bypass (window.__npcSoundLockBypass) releases; expired window releases.
// Careful: `window` is created/removed PER TEST so it does not leak into other
// files of the same worker (taulukko-commons detects the environment on load).
import { injectController } from "taulukko-commons";
import { NPC } from "../../../submodules/npc/npc";

class FakeNPC extends NPC {
  groupToLines = new Map<string, string>();
  lines: any = { 1: "line 1", 2: "line 2" };
  constructor() {
    super("Fake", "fake.webp");
  }
  public async startScreen(): Promise<void> {}
}

describe("R3 — per-NPC sound lock (5s)", () => {
  let npc: FakeNPC;
  const playMock = jest.fn();
  const realFetch = globalThis.fetch;

  beforeAll(() => {
    (globalThis as any).foundry = (globalThis as any).foundry || {};
    (globalThis as any).foundry.audio = { AudioHelper: { play: playMock } };
    (globalThis as any).fetch = jest.fn(async () => ({
      ok: true,
      status: 200,
    }));
    npc = new FakeNPC();
    injectController.registerByName("NPCDialog", {
      npcSelected: npc,
      isReady: () => true,
    } as any);
  });

  beforeEach(() => {
    playMock.mockClear();
    npc.lastSoundAt = 0;
    (globalThis as any).window = {};
    (globalThis as any).window.__npcSoundLockBypass = false;
  });

  afterEach(() => {
    delete (globalThis as any).window;
  });

  afterAll(() => {
    (globalThis as any).fetch = realFetch;
    (globalThis as any).foundry.audio = {
      AudioHelper: { play: () => undefined },
    };
  });

  it("plays the first sound and blocks the second for the same NPC within 5s", async () => {
    const first = await (npc as any).playSoundWithNoEffect("a.ogg");
    const second = await (npc as any).playSoundWithNoEffect("b.ogg");
    expect(first).toBe(true);
    expect(second).toBe(false);
    expect(playMock).toHaveBeenCalledTimes(1);
  });

  it("allows when the test bypass is on", async () => {
    await (npc as any).playSoundWithNoEffect("a.ogg");
    (globalThis as any).window.__npcSoundLockBypass = true;
    const second = await (npc as any).playSoundWithNoEffect("b.ogg");
    expect(second).toBe(true);
    expect(playMock).toHaveBeenCalledTimes(2);
  });

  it("releases again after the 5s window", async () => {
    await (npc as any).playSoundWithNoEffect("a.ogg");
    npc.lastSoundAt = Date.now() - 6000;
    const second = await (npc as any).playSoundWithNoEffect("b.ogg");
    expect(second).toBe(true);
  });
});
