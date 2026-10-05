// R9 tests — pre-send confirmation screen (buttons: Cancelar / Recalcular / Enviar).
// Enviar fires speak with the rolled line; Recalcular rolls again (reopens the
// screen with the new text); Cancelar sends nothing. Uses a fake DialogUtils
// that captures the created buttons, to trigger the callbacks manually.
import { injectController } from "taulukko-commons";
import { NPC } from "../../../submodules/npc/npc";

class FakeNPC extends NPC {
  groupToLines = new Map<string, string>();
  lines: any = { 1: "line one", 2: "line two", 3: "line three" };
  spoken: number[] = [];
  constructor() {
    super("Fake", "fake.webp");
  }
  public async startScreen(): Promise<void> {}
  public async speak(lineIndex: number): Promise<void> {
    this.spoken.push(lineIndex);
  }
}

describe("R9 — confirmation before sending", () => {
  let npc: FakeNPC;
  const dialogs: any[] = [];
  const fakeDialogUtils = {
    createButton: (
      action: string,
      label: string,
      defaultValue: boolean,
      type: string,
      callback: any,
    ) => ({ action, label, defaultValue, type, callback }),
    createDialog: (
      title: string,
      style: string,
      content: string,
      buttons: any[],
    ) => {
      dialogs.push({ title, style, content, buttons });
      return { close: () => undefined };
    },
  };
  const fakeDialogEl = { close: () => undefined };

  beforeAll(() => {
    npc = new FakeNPC();
    injectController.registerByName("DialogUtils", fakeDialogUtils as any);
    injectController.registerByName("NPCDialog", {
      npcSelected: npc,
      isReady: () => true,
    } as any);
  });

  beforeEach(() => {
    dialogs.length = 0;
    npc.spoken = [];
  });

  const lastDialog = () => dialogs[dialogs.length - 1];
  const btn = (label: string) =>
    lastDialog().buttons.find((b: any) => b.label === label);

  it("Enviar fires the rolled line (button order: Cancelar, Recalcular, Enviar)", async () => {
    (npc as any).confirmTalk(() => 2, 2);
    expect(dialogs.length).toBe(1);
    expect(String(lastDialog().title)).toContain("confirmar fala");
    expect(String(lastDialog().content)).toContain("line two");
    expect(lastDialog().buttons.map((b: any) => b.label)).toEqual([
      "Cancelar",
      "Recalcular",
      "Enviar",
    ]);
    btn("Enviar").callback(null, null, fakeDialogEl);
    expect(npc.spoken).toEqual([2]);
  });

  it("Recalcular re-rolls, reopens with the new text and Enviar sends the new one", async () => {
    let calls = 0;
    const pick = () => {
      calls++;
      return calls === 1 ? 1 : 3;
    };
    (npc as any).confirmTalk(pick, pick());
    expect(String(lastDialog().content)).toContain("line one");
    btn("Recalcular").callback(null, null, fakeDialogEl);
    expect(calls).toBe(2);
    expect(dialogs.length).toBe(2);
    expect(String(lastDialog().content)).toContain("line three");
    btn("Enviar").callback(null, null, fakeDialogEl);
    expect(npc.spoken).toEqual([3]);
  });

  it("Cancelar sends nothing", async () => {
    (npc as any).confirmTalk(() => 1, 1);
    btn("Cancelar").callback(null, null, fakeDialogEl);
    expect(npc.spoken).toEqual([]);
  });
});
