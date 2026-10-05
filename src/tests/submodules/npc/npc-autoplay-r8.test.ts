// R8 tests — on-demand speech sound: in normal use NO sound plays automatically
// (the "Ouvir" button on the speech screen plays it); tests/debug re-enable auto-play
// with window.__npcSoundAutoPlay = true (the audio battery stays fast).
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

describe("R8 — speech sound auto-play (normal use vs tests)", () => {
  let npc: FakeNPC;
  const playMock = jest.fn();
  const createMock: jest.Mock = jest.fn(async () => ({ id: "m1" }));
  const realFetch = globalThis.fetch;

  beforeAll(() => {
    (globalThis as any).foundry = (globalThis as any).foundry || {};
    (globalThis as any).foundry.audio = { AudioHelper: { play: playMock } };
    (globalThis as any).fetch = jest.fn(async () => ({
      ok: true,
      status: 200,
    }));
    (globalThis as any).ChatMessage = { create: createMock };
    npc = new FakeNPC();
    injectController.registerByName("NPCDialog", {
      npcSelected: npc,
      isReady: () => true,
    } as any);
    injectController.registerByName("GameContext", {
      users: { values: () => ([] as any)[Symbol.iterator]() },
    } as any);
  });

  beforeEach(() => {
    playMock.mockClear();
    createMock.mockClear();
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

  it("normal use: the message goes out, but NO sound plays on its own", async () => {
    await (npc as any).speak(1);
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(playMock).not.toHaveBeenCalled();
  });

  it("tests: with __npcSoundAutoPlay=true the sound plays automatically", async () => {
    (globalThis as any).window.__npcSoundAutoPlay = true;
    (globalThis as any).window.__npcSoundLockBypass = true;
    await (npc as any).speak(1);
    expect(playMock).toHaveBeenCalledTimes(1);
    expect(String(playMock.mock.calls[0][0].src)).toContain("Fake001");
  });

  it("the message carries soundSrc for the Ouvir button", async () => {
    await (npc as any).speak(2);
    const sent: any = createMock.mock.calls[0][0];
    expect(sent.flags["npc-talk"].type).toBe("npcDialogOnTalk");
    expect(String(sent.flags["npc-talk"].payload.soundSrc)).toContain(
      "Fake002",
    );
  });
});
