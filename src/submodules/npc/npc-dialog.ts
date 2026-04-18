import { Log, injectController } from "taulukko-commons";
import { SubModuleBase } from "../sub-module-base";
import { DialogUtils } from "../dialog-utils/dialog-utils";
import { NPC } from "./npc";
import { NPCPortraitDialog } from "./npc-portrait-dialog";
import type { IGameContext } from "../../common/igame-context";

export class NPCDialog extends SubModuleBase {
  public npcSelected: NPC | any;
  public npcs: Map<string, NPC> = new Map();
  public buttonloaded: boolean = false;
  #requiredHooksLoaded: boolean = false;

  public get requiredHooksLoaded(): boolean {
    return this.#requiredHooksLoaded;
  }

  public set requiredHooksLoaded(val: boolean) {
    this.#requiredHooksLoaded = val;
  }

  protected async initHooks() {
    Hooks.on("createChatMessage", async (message: any) => {
      const logguer: Log = injectController.resolve("CommonLogguer");
      try {
        logguer.debug("createChatMessage recebido...", message);
        // Verifica se é um evento nosso
        if (message.flags?.["npc-talk"]?.type === "npcDialogOnTalk") {
          const data = message.flags["npc-talk"].payload;
          logguer.debug("[NPC Portrait] Evento recebido dos jogadores:", data);

          NPCPortraitDialog.renderTalk(data);
        }
      } catch (e) {
        logguer.error("[NPC Portrait] Erro ao processar evento:", e);
      }
    });

    Hooks.on("getSceneControlButtons", async (controls: any) => {
      const logguer: Log = injectController.resolve("CommonLogguer");
      const npcDialog: NPCDialog = injectController.resolve("NPCDialog");

      await npcDialog.addNPCButtons(controls);

      //com sockets nao funcionou
      /*
			(game.socket as any).on('forgotten-realms', (data: any) => {
				if (data.type === 'npcDialogOnTalk') {
					commonModule.debug("recebendo o evento:");
		
					NPCPortraitDialog.renderTalk(data);
				}
			});*/

      //com hoooks nao funcionou

      /**	Hooks.on('npcDialogOnTalk',async  (data: any) => {
	
			commonModule.debug("npcDialogOnTalk received...") ;  
			NPCPortraitDialog.renderTalk(data);
			commonModule.debug("npcDialogOnTalk created...") ;  
	
		}); */

      logguer.debug("On getSceneControlButtons...:20");
    });
  }

  protected async waitReady() {
    const npcDialog: NPCDialog = injectController.resolve("NPCDialog");
    npcDialog.requiredHooksLoaded = true;
  }

  public async addNPCButtons(controls: any) {
    const gameContext: IGameContext = injectController.resolve(
      "GameContext",
    ) as IGameContext;
    const logguer: Log = injectController.resolve("CommonLogguer");
    const npcDialog: NPCDialog = injectController.resolve("NPCDialog");

    if (!gameContext.user?.isGM) {
      logguer.debug("NPC Buttons off");
      return;
    }

    logguer.debug("Criando botão dos NPCs especiais", controls);
    controls.tokens.tools["npcButton"] = {
      name: "npcButton",
      title: "NPCs Especiais",
      icon: "fa-solid fa-web-awesome",
      button: true,
      toggle: false,
      onClick: () => {
        logguer.debug("Botão de NPCs especiais pressionado");

        npcDialog.showNPCChooseDialog();
        logguer.debug("Após abrir janela de NPCs especiais");
      },
    };

    logguer.debug("Botão de NPC criado");
  }

  public async showNPCChooseDialog() {
    const logguer: Log = injectController.resolve("CommonLogguer");
    const npcDialog: NPCDialog = injectController.resolve("NPCDialog");

    const fiveMinute: number = 5 * 60 * 1000;
    await npcDialog.whaitFor(
      () => injectController.has("DialogUtils"),
      fiveMinute,
    );

    if (!injectController.has("DialogUtils")) {
      throw new Error(
        "NPCDialog getSceneControlButtons : Time out waiting for dialog utils inject",
      );
    }

    const dialogUtils: DialogUtils = injectController.resolve("DialogUtils");
    logguer.debug("On showNPCChooseDialog 05...", dialogUtils);

    logguer.debug("Botão NPCsespecial pressionado, mostrando diálogo...");

    const title = "Escolha um NPC Especial";
    const style = `
					.select-npc  { padding: 20px; background: #222; color: #eee; }
					.select-npc button { margin: 5px; padding: 5px 10px; }
					`;
    const content = `
					<div class="select-npc">
					<H1>Escolha uma opção:</H1> 
					</div>`;

    logguer.debug("showNPCChooseDialog:10 before creating buttons", npcDialog);

    let buttons = [];

    npcDialog.npcs.forEach((npc) => {
      const label: string = npc.name.toLowerCase();
      injectController.registerByName("npc:" + label, npc);

      logguer.debug("showNPCChooseDialog:15 add NPC ", npc.name, npc);

      buttons.push(
        dialogUtils.createButton(label, npc.name, true, "screen", () => {
          const npcDialog: NPCDialog = injectController.resolve("NPCDialog");
          const npc: NPC = injectController.resolve("npc:" + label);
          npcDialog.callNPC(npc);
        }),
      );
    });
    buttons.push(dialogUtils.createButton("cancel", "Cancel", false, "screen"));

    logguer.debug("showNPCChooseDialog:20 after creating buttons");

    dialogUtils.createDialog(
      title,
      style,
      content,
      buttons,
      undefined,
      200,
      undefined,
      400,
    );

    logguer.debug("showNPCChooseDialog:30 after createDialog");
  }

  public helpSubmit: string = `
			Submit need be a function:
			(action,label,defaultValue,callback)=>{
				return result => {
						 
					}
			}
			`;

  public async callNPC(npc: NPC) {
    const npcDialog: NPCDialog = injectController.resolve("NPCDialog");
    const logguer: Log = injectController.resolve("CommonLogguer");
    logguer.debug("Selecionado ...", npc);
    npcDialog.npcSelected = npc;
    await npcDialog.npcSelected.startScreen();
  }
}
