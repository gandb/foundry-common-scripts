// NPC stability tests — R4: per-INSTANCE routing.
// Ensures the methods use `this` (the window owner) and not the global
// npcSelected slot — and that one NPC's state does not leak into the other.
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

describe("R4 — per-instance routing (does not use the global slot)", () => {
  it("getAlias uses this, not npcSelected", () => {
    const a = new FakeNPC("Alfa");
    const b = new FakeNPC("Beta");
    injectController.registerByName("NPCDialog", {
      npcSelected: b,
      isReady: () => true,
    } as any);
    expect(a.getAlias()).toBe("alfa");
    expect(b.getAlias()).toBe("beta");
  });

  it("decrementGroup touches only the owning instance", () => {
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

  it("state (groups) is per-instance from the start", () => {
    const a = new FakeNPC("Alfa");
    const b = new FakeNPC("Beta");
    a.groups.add("1");
    expect(a.groups.size).toBe(1);
    expect(b.groups.size).toBe(0);
  });
});
