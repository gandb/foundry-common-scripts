// R10 tests — tab switch without reset (switchToNpc preserves groups/screens).
// bindTabs without DOM (jest/node) must exit silently, without throwing.
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

describe("R10 — switchToNpc (tab without reset)", () => {
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

  it("switches to the NPC and re-renders the top WITHOUT resetting groups/screens", async () => {
    a.groups = new Set(["1", "2"]);
    a.screens = [{ name: "x", callback: async () => {}, type: "screen" }];
    const ok = await dlg.switchToNpc("alfa");
    expect(ok).toBe(true);
    expect((injectController.resolve("NPCDialog") as any).npcSelected).toBe(a);
    expect(Array.from(a.groups)).toEqual(["1", "2"]);
    expect(a.screens.length).toBe(1);
  });

  it("empty stack pushes the root and calls startScreen", async () => {
    b.groups = new Set<string>();
    b.screens = [];
    b.calls = 0;
    const ok = await dlg.switchToNpc("Beta");
    expect(ok).toBe(true);
    expect(b.screens.length).toBe(1);
    expect(b.screens[0].name).toBe("root");
    expect(b.calls).toBe(1);
  });

  it("unknown name returns false and does not switch the selected one", async () => {
    (injectController.resolve("NPCDialog") as any).npcSelected = a;
    const ok = await dlg.switchToNpc("Zeta");
    expect(ok).toBe(false);
    expect((injectController.resolve("NPCDialog") as any).npcSelected).toBe(a);
  });

  it("bindRail without DOM does not throw", () => {
    expect(() => dlg.bindRail(null, "Alfa")).not.toThrow();
  });
});
