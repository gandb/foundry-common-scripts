// Testes de estabilidade do NPC — R3: trava de som por NPC (janela de 5s).
// Cobre: primeiro som toca; segundo do MESMO NPC dentro de 5s e bloqueado;
// bypass de teste (window.__npcSoundLockBypass) libera; janela expirada libera.
// Cuidado: `window` e criado/removido POR TESTE para nao vazar para outros
// arquivos do mesmo worker (o taulukko-commons detecta ambiente na carga).
import { injectController } from "taulukko-commons";
import { NPC } from "../../../submodules/npc/npc";

class FakeNPC extends NPC {
  groupToLines = new Map<string, string>();
  lines: any = { 1: "linha 1", 2: "linha 2" };
  constructor() {
    super("Fake", "fake.webp");
  }
  public async startScreen(): Promise<void> {}
}

describe("R3 — trava de som por NPC (5s)", () => {
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

  it("toca o primeiro som e bloqueia o segundo do mesmo NPC dentro de 5s", async () => {
    const first = await (npc as any).playSoundWithNoEffect("a.ogg");
    const second = await (npc as any).playSoundWithNoEffect("b.ogg");
    expect(first).toBe(true);
    expect(second).toBe(false);
    expect(playMock).toHaveBeenCalledTimes(1);
  });

  it("permite quando o bypass de teste esta ligado", async () => {
    await (npc as any).playSoundWithNoEffect("a.ogg");
    (globalThis as any).window.__npcSoundLockBypass = true;
    const second = await (npc as any).playSoundWithNoEffect("b.ogg");
    expect(second).toBe(true);
    expect(playMock).toHaveBeenCalledTimes(2);
  });

  it("libera de novo apos a janela de 5 segundos", async () => {
    await (npc as any).playSoundWithNoEffect("a.ogg");
    npc.lastSoundAt = Date.now() - 6000;
    const second = await (npc as any).playSoundWithNoEffect("b.ogg");
    expect(second).toBe(true);
  });
});
