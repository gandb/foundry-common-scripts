import { injectController } from "taulukko-commons";
import type { IGameContext } from "../../common/igame-context";

interface NPCPortraitOptions {
  imageUrl: string;
  npcName: string;
  dialogText: string;
  soundSrc?: string;
}

interface NPCPortraitSocketPayload {
  type: "showNPCPortrait";
  data: NPCPortraitOptions;
}

/**
 * Custom class to show an NPC portrait with a dialog.
 * Works as a modal overlay over the game.
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
  soundSrc: string;

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
    this.soundSrc = options.soundSrc || "";
  }

  async _prepareContext(options?: any): Promise<any> {
    return {
      imageUrl: this.imageUrl,
      npcName: this.npcName,
      dialogText: this.dialogText,
      soundSrc: this.soundSrc,
    };
  }

  _onRender(context: any, options: any): void {
    const el: any = this.element;
    const close = el?.querySelector?.(".close-button");
    if (close) {
      close.addEventListener("click", () => this.close());
    }
    // R8: "Ouvir" button — each player plays the line sound whenever they want
    const playBtn = el?.querySelector?.(".npc-sound-button");
    if (playBtn && this.soundSrc) {
      playBtn.addEventListener("click", () => this.playSound());
    }
  }

  /**
   * R8: reproduz o som da fala localmente (apenas o cliente que clicou ouve).
   * Same NPC file check (HEAD) to fail silently when missing.
   */
  async playSound(): Promise<boolean> {
    if (!this.soundSrc) {
      return false;
    }
    try {
      const response = await fetch(this.soundSrc, { method: "HEAD" });
      if (!response.ok) {
        console.warn(`File not found: ${this.soundSrc} (${response.status})`);
        return false;
      }
      // R8: second parameter = socketOptions; false = do NOT push to other
      // clients — only this client hears it (on-demand sound).
      foundry.audio.AudioHelper.play(
        { src: this.soundSrc, autoplay: true },
        false,
      );
      return true;
    } catch (error: any) {
      console.error("Error playing the sound:", this.soundSrc, error);
      return false;
    }
  }

  static renderTalk(data: {
    imageUrl: string;
    npcName: string;
    dialogText: string;
    soundSrc?: string;
  }): void {
    const dialog = new (NPCPortraitDialog as any)({
      imageUrl: data.imageUrl,
      npcName: data.npcName,
      dialogText: data.dialogText,
      soundSrc: data.soundSrc,
    });
    dialog.render({ force: true });
  }

  /**
   * Shows the dialog to all players
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
