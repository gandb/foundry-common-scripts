 
// modules/seu-modulo/src/apps/npc-portrait-dialog.ts

interface NPCPortraitOptions {
  imageUrl: string;
  npcName: string;
  dialogText: string;
}

interface NPCPortraitSocketPayload {
  type: 'showNPCPortrait';
  data: NPCPortraitOptions;
}

/**
 * Classe customizada para exibir um retrato de NPC com diálogo
 * Funciona como overlay modal sobre o jogo
 */
export class NPCPortraitDialog extends Application {
  imageUrl: string;
  npcName: string;
  dialogText: string;

  constructor(options: Partial<NPCPortraitOptions> & any = {}) {
    super();
    this.imageUrl = options.imageUrl || 'YOUR_IMAGE_URL_HERE';
    this.npcName = options.npcName || 'NPC';
    this.dialogText = options.dialogText || 'Olá, aventureiro...';
  }

 static get defaultOptions(): any { 
    return foundry.utils.mergeObject(Application.defaultOptions, {
      id: 'npc-portrait-dialog',
      classes: ['npc-portrait-app'],
      title: '',
      width: 600,
      height: 400,
      resizable: false,
      minimizable: false,
      popOut: true,
    } as any);
  }

  get template(): string {
    return 'modules/forgotten-realms/scripts/templates/npc-talk.hbs';
  }

  async getData(): Promise<NPCPortraitOptions> {
    return {
      imageUrl: this.imageUrl,
      npcName: this.npcName,
      dialogText: this.dialogText,
    };
  }

  activateListeners(html: any): void {
    super.activateListeners(html);

    // Botão de fechar (X)
    html.on('click', '.close-button', () => {
      this.close();
    });
  }

  static renderTalk( data: {
    imageUrl: string;
    npcName: string;
    dialogText: string;
  }): void {
    const dialog = new (NPCPortraitDialog as any)({
      imageUrl: data.imageUrl,
      npcName: data.npcName,
      dialogText: data.dialogText,
    });
    dialog.render(true);
  }

  /**
   * Exibe o diálogo para todos os jogadores
   */
  async showToAllPlayers(): Promise<void> {
    // Renderiza localmente
    this.render(true);

    // Se for GM, sincroniza com os outros jogadores via socket
    if (game.user?.isGM) {
      const socketPayload: NPCPortraitSocketPayload = {
        type: 'showNPCPortrait',
        data: {
          imageUrl: this.imageUrl,
          npcName: this.npcName,
          dialogText: this.dialogText,
        },
      };

      (game.socket as any).emit('module.seu-modulo', socketPayload);
    }
  }
}
 