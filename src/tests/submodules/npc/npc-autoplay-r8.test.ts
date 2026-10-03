// Testes R8 — som da fala sob demanda: em uso normal NENHUM som toca automaticamente
// (quem toca e o botao "Ouvir" da tela de fala); testes/depuracao religam o auto-play
// com window.__npcSoundAutoPlay = true (bateria de audio continua rapida).
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

describe("R8 — auto-play do som da fala (uso normal x testes)", () => {
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

  it("uso normal: a mensagem sai, mas NENHUM som toca sozinho", async () => {
    await (npc as any).speak(1);
    expect(createMock).toHaveBeenCalledTimes(1);
    expect(playMock).not.toHaveBeenCalled();
  });

  it("testes: com __npcSoundAutoPlay=true o som toca automaticamente", async () => {
    (globalThis as any).window.__npcSoundAutoPlay = true;
    (globalThis as any).window.__npcSoundLockBypass = true;
    await (npc as any).speak(1);
    expect(playMock).toHaveBeenCalledTimes(1);
    expect(String(playMock.mock.calls[0][0].src)).toContain("Fake001");
  });

  it("a mensagem carrega soundSrc para o botao Ouvir", async () => {
    await (npc as any).speak(2);
    const sent: any = createMock.mock.calls[0][0];
    expect(sent.flags["npc-talk"].type).toBe("npcDialogOnTalk");
    expect(String(sent.flags["npc-talk"].payload.soundSrc)).toContain(
      "Fake002",
    );
  });
});
