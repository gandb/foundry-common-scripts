import { injectController } from "taulukko-commons";
import type { IGameContext } from "../../common/igame-context";

interface NPCPortraitOptions {
  imageUrl: string;
  npcName: string;
  dialogText: string;
}

interface NPCPortraitSocketPayload {
  type: "showNPCPortrait";
  data: NPCPortraitOptions;
}

/**
 * Classe customizada para exibir um retrato de NPC com diálogo.
 * Funciona como overlay modal sobre o jogo.
 * Migrado de V1 Application para ApplicationV2 (fix deprecation, task 6).
 */
const NPCPortraitBase = (
  foundry as any
).applications.api.HandlebarsApplicationMixin(
  (foundry as any).applications.api.ApplicationV2,
);

export class NPCPortraitDialog extends (NPCPortraitBase as any) {
  imageUrl: string;
  npcName: string;
  dialogText: string;

  static DEFAULT_OPTIONS = {
    id: "npc-portrait-dialog",
    classes: ["npc-portrait-app"],
    window: {
      title: "",
      resizable: false,
      minimizable: false,
      frame: true,
    },
    position: { width: 600, height: 400 },
  } as any;

  static PARTS = {
    main: {
      template: "modules/common-scripts-dnd5ed/scripts/templates/npc-talk.hbs",
    },
  } as any;

  constructor(options: Partial<NPCPortraitOptions> & any = {}) {
    super(options);
    this.imageUrl = options.imageUrl || "YOUR_IMAGE_URL_HERE";
    this.npcName = options.npcName || "NPC";
    this.dialogText = options.dialogText || "Olá, aventureiro...";
  }

  async _prepareContext(options?: any): Promise<any> {
    return {
      imageUrl: this.imageUrl,
      npcName: this.npcName,
      dialogText: this.dialogText,
    };
  }

  _onRender(context: any, options: any): void {
    const el: any = this.element;
    const close = el?.querySelector?.(".close-button");
    if (close) {
      close.addEventListener("click", () => this.close());
    }
  }

  static renderTalk(data: {
    imageUrl: string;
    npcName: string;
    dialogText: string;
  }): void {
    const dialog = new (NPCPortraitDialog as any)({
      imageUrl: data.imageUrl,
      npcName: data.npcName,
      dialogText: data.dialogText,
    });
    dialog.render({ force: true });
  }

  /**
   * Exibe o diálogo para todos os jogadores
   */
  async showToAllPlayers(): Promise<void> {
    let gameContextRef: IGameContext | undefined = undefined;
    const gameContext: IGameContext = (
      injectController.has("GameContext")
        ? (injectController.resolve("GameContext") as IGameContext)
        : gameContextRef
    ) as IGameContext;
    if (!gameContext) {
      throw new Error(
        "Required dependency 'GameContext' not registered and no fallback available",
      );
    }

    // Renderiza localmente
    this.render({ force: true });

    // Se for GM, sincroniza com os outros jogadores via socket
    if (gameContext.user?.isGM) {
      const socketPayload: NPCPortraitSocketPayload = {
        type: "showNPCPortrait",
        data: {
          imageUrl: this.imageUrl,
          npcName: this.npcName,
          dialogText: this.dialogText,
        },
      };

      (gameContext.socket as any).emit("module.seu-modulo", socketPayload);
    }
  }
}
