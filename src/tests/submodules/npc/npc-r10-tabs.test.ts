// Testes R10 — troca de aba sem reset (switchToNpc preserva groups/screens).
// bindTabs sem DOM (jest/node) deve sair em silencio, sem lançar.
import { injectController } from "taulukko-commons";
import { NPC } from "../../../submodules/npc/npc";
import { NPCDialog } from "../../../submodules/npc/npc-dialog";

class FakeNPC extends NPC {
  groupToLines = new Map<string, string>();
  lines: any = {};
  calls = 0;
  constructor(name: string) {
    super(name, "x.webp");
  }
  public async startScreen(): Promise<void> {
    this.calls++;
  }
}

describe("R10 — switchToNpc (aba sem reset)", () => {
  let dlg: NPCDialog;
  let a: FakeNPC;
  let b: FakeNPC;

  beforeAll(() => {
    dlg = new NPCDialog();
    a = new FakeNPC("Alfa");
    b = new FakeNPC("Beta");
    dlg.npcs = new Map<string, NPC>([
      ["Alfa", a],
      ["Beta", b],
    ]);
    injectController.registerByName("NPCDialog", dlg as any);
    injectController.registerByName("CommonLogguer", {
      debug: () => undefined,
      error: () => undefined,
      warn: () => undefined,
    } as any);
  });

  it("troca para o NPC e re-renderiza o topo SEM resetar groups/screens", async () => {
    a.groups = new Set(["1", "2"]);
    a.screens = [{ name: "x", callback: async () => {}, type: "screen" }];
    const ok = await dlg.switchToNpc("alfa");
    expect(ok).toBe(true);
    expect((injectController.resolve("NPCDialog") as any).npcSelected).toBe(a);
    expect(Array.from(a.groups)).toEqual(["1", "2"]);
    expect(a.screens.length).toBe(1);
  });

  it("pilha vazia empilha a raiz e chama startScreen", async () => {
    b.groups = new Set<string>();
    b.screens = [];
    b.calls = 0;
    const ok = await dlg.switchToNpc("Beta");
    expect(ok).toBe(true);
    expect(b.screens.length).toBe(1);
    expect(b.screens[0].name).toBe("root");
    expect(b.calls).toBe(1);
  });

  it("nome desconhecido retorna false e nao troca o selecionado", async () => {
    (injectController.resolve("NPCDialog") as any).npcSelected = a;
    const ok = await dlg.switchToNpc("Zeta");
    expect(ok).toBe(false);
    expect((injectController.resolve("NPCDialog") as any).npcSelected).toBe(a);
  });

  it("bindTabs sem DOM nao lanca", () => {
    expect(() => dlg.bindTabs(null, "Alfa")).not.toThrow();
  });
});
