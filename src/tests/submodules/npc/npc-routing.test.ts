// Testes de estabilidade do NPC — R4: roteamento por INSTANCIA.
// Garante que os metodos usam `this` (o dono da janela) e nao o slot global
// npcSelected — e que o estado de um NPC nao vaza para o outro.
import { injectController } from "taulukko-commons";
import { NPC } from "../../../submodules/npc/npc";

class FakeNPC extends NPC {
  groupToLines = new Map<string, string>();
  lines: any = {};
  constructor(name: string) {
    super(name, "x.webp");
  }
  public async startScreen(): Promise<void> {}
}

describe("R4 — roteamento por instancia (nao usa o slot global)", () => {
  it("getAlias usa this, nao o npcSelected", () => {
    const a = new FakeNPC("Alfa");
    const b = new FakeNPC("Beta");
    injectController.registerByName("NPCDialog", {
      npcSelected: b,
      isReady: () => true,
    } as any);
    expect(a.getAlias()).toBe("alfa");
    expect(b.getAlias()).toBe("beta");
  });

  it("decrementGroup mexe so na instancia dona", () => {
    const a = new FakeNPC("Alfa");
    const b = new FakeNPC("Beta");
    a.groups = new Set(["1", "2"]);
    b.groups = new Set(["9"]);
    injectController.registerByName("NPCDialog", {
      npcSelected: b,
      isReady: () => true,
    } as any);
    a.decrementGroup();
    expect(Array.from(a.groups)).toEqual(["1"]);
    expect(Array.from(b.groups)).toEqual(["9"]);
  });

  it("estado (groups) e por instancia desde o inicio", () => {
    const a = new FakeNPC("Alfa");
    const b = new FakeNPC("Beta");
    a.groups.add("1");
    expect(a.groups.size).toBe(1);
    expect(b.groups.size).toBe(0);
  });
});
