// Testes R9 — tela de confirmacao antes de enviar (Cancelar / Recalcular / Enviar).
// Enviar dispara speak com a fala sorteada; Recalcular re-sorteia (reabre a tela
// com o novo texto); Cancelar nao envia nada. Usa um DialogUtils falso que
// captura os botoes criados, para acionar os callbacks manualmente.
import { injectController } from "taulukko-commons";
import { NPC } from "../../../submodules/npc/npc";

class FakeNPC extends NPC {
  groupToLines = new Map<string, string>();
  lines: any = { 1: "fala um", 2: "fala dois", 3: "fala tres" };
  spoken: number[] = [];
  constructor() {
    super("Fake", "fake.webp");
  }
  public async startScreen(): Promise<void> {}
  public async speak(lineIndex: number): Promise<void> {
    this.spoken.push(lineIndex);
  }
}

describe("R9 — confirmacao antes de enviar", () => {
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

  it("Enviar dispara a fala sorteada (ordem dos botoes: Cancelar, Recalcular, Enviar)", async () => {
    (npc as any).confirmTalk(() => 2, 2);
    expect(dialogs.length).toBe(1);
    expect(String(lastDialog().title)).toContain("confirmar fala");
    expect(String(lastDialog().content)).toContain("fala dois");
    expect(lastDialog().buttons.map((b: any) => b.label)).toEqual([
      "Cancelar",
      "Recalcular",
      "Enviar",
    ]);
    btn("Enviar").callback(null, null, fakeDialogEl);
    expect(npc.spoken).toEqual([2]);
  });

  it("Recalcular re-sorteia, reabre com o novo texto e Enviar manda o novo", async () => {
    let calls = 0;
    const pick = () => {
      calls++;
      return calls === 1 ? 1 : 3;
    };
    (npc as any).confirmTalk(pick, pick());
    expect(String(lastDialog().content)).toContain("fala um");
    btn("Recalcular").callback(null, null, fakeDialogEl);
    expect(calls).toBe(2);
    expect(dialogs.length).toBe(2);
    expect(String(lastDialog().content)).toContain("fala tres");
    btn("Enviar").callback(null, null, fakeDialogEl);
    expect(npc.spoken).toEqual([3]);
  });

  it("Cancelar nao envia nada", async () => {
    (npc as any).confirmTalk(() => 1, 1);
    btn("Cancelar").callback(null, null, fakeDialogEl);
    expect(npc.spoken).toEqual([]);
  });
});
