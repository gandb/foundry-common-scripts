import { Log, injectController } from "taulukko-commons";
import { SubModuleBase } from "../sub-module-base";
import { DialogUtils } from "../dialog-utils/dialog-utils";
import { NPC } from "./npc";
import { NPCPortraitDialog } from "./npc-portrait-dialog";
import type { IGameContext } from "../../common/igame-context";

let npcDialog: NPCDialog | undefined = undefined;

// R1 — som de UI (hover/clique) sintetizado via WebAudio (sem assets);
// silencioso se indisponivel. Curto e em volume baixo.
function playUiSound(kind: "hover" | "click"): void {
  try {
    const w = window as any;
    const Ctx = w.AudioContext || w.webkitAudioContext;
    if (!Ctx) {
      return;
    }
    if (!w.__taulukkoUiAudio) {
      w.__taulukkoUiAudio = new Ctx();
    }
    const ctx: any = w.__taulukkoUiAudio;
    if (ctx.state === "suspended" && ctx.resume) {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = kind === "hover" ? 780 : 520;
    const peak = kind === "hover" ? 0.035 : 0.06;
    const dur = kind === "hover" ? 0.06 : 0.09;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  } catch (e) {}
}

export class NPCDialog extends SubModuleBase {
  constructor() {
    super();
    npcDialog = this;
  }
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
      npcDialog = (
        injectController.has("NPCDialog")
          ? injectController.resolve("NPCDialog")
          : npcDialog
      ) as NPCDialog;

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
    const npcDialogInstance: NPCDialog = (
      injectController.has("NPCDialog")
        ? injectController.resolve("NPCDialog")
        : npcDialog
    ) as NPCDialog;
    npcDialogInstance.requiredHooksLoaded = true;
  }

  public async addNPCButtons(controls: any) {
    const gameContext: IGameContext = injectController.resolve(
      "GameContext",
    ) as IGameContext;
    const logguer: Log = injectController.resolve("CommonLogguer");
    const npcDialogInstance: NPCDialog = (
      injectController.has("NPCDialog")
        ? injectController.resolve("NPCDialog")
        : npcDialog
    ) as NPCDialog;

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
      onChange: () => {
        logguer.debug("Botão de NPCs especiais pressionado");

        npcDialogInstance.showNPCChooseDialog();
        logguer.debug("Após abrir janela de NPCs especiais");
      },
    };

    logguer.debug("Botão de NPC criado");
  }

  public async showNPCChooseDialog() {
    const logguer: Log = injectController.resolve("CommonLogguer");
    const npcDialogInstance: NPCDialog = (
      injectController.has("NPCDialog")
        ? injectController.resolve("NPCDialog")
        : npcDialog
    ) as NPCDialog;

    const fiveMinute: number = 5 * 60 * 1000;
    await npcDialogInstance.whaitFor(
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
					.select-npc { padding: 4px 2px; }
					`;
    const cardsHtml = Array.from(npcDialogInstance.npcs.values())
      .map((npc: NPC) => {
        const label: string = npc.name.toLowerCase();
        return `<div class="npc-card" data-npc="${label}" title="${npc.name}"><img src="${npc.imageUrl}" alt="${npc.name}"><div class="npc-card-name">${npc.name}</div></div>`;
      })
      .join("");
    const content = `
					<div class="select-npc">
					<H1>Escolha um NPC Especial:</H1>
					<div class="npc-select-grid">${cardsHtml}</div>
					</div>`;

    logguer.debug(
      "showNPCChooseDialog:10 before creating buttons",
      npcDialogInstance,
    );

    let buttons = [];

    npcDialogInstance.npcs.forEach((npc) => {
      const label: string = npc.name.toLowerCase();
      injectController.registerByName("npc:" + label, npc);

      logguer.debug("showNPCChooseDialog:15 add NPC ", npc.name, npc);
    });
    buttons.push(dialogUtils.createButton("cancel", "Cancel", false, "screen"));
    // [tmp/debug] Janela de debug: seletor de NPC -> roda o teste de audio correspondente.
    // Temporario: remover quando o teste de audio terminar. Substitui o loader via console.
    const runAudioTest = async (filterValue: string) => {
      try {
        const filter =
          filterValue === "Minsc"
            ? ["Minsc"]
            : filterValue === "Brizola"
              ? ["Brizola"]
              : ["Minsc", "Brizola"];
        (window as any).__audioTestFilter = filter;
        const resp = await fetch(
          "/modules/forgotten-realms/scripts/tmp/npc-e2e/audio-test-once.js",
        );
        if (!resp.ok) {
          ui.notifications?.warn(
            "Debug: script de teste nao encontrado (" + resp.status + ")",
          );
          return;
        }
        const src = await resp.text();
        (0, eval)(src);
      } catch (e: any) {
        logguer.error("Debug falhou:", e);
        ui.notifications?.error("Debug falhou: " + (e?.message || e));
      }
    };
    const openDebugWindow = () => {
      const debugTitle = "Debug";
      let progressTxt = "";
      try {
        const raw = JSON.parse(
          localStorage.getItem("npc-audio-test-v1") || "{}",
        );
        const doneCount = Object.keys((raw && raw.done) || {}).length;
        let totalAll = 0;
        npcDialogInstance.npcs.forEach((npc: any) => {
          if (npc && npc.lines) {
            totalAll += Object.keys(npc.lines).length;
          }
        });
        progressTxt =
          "Progresso do teste: " +
          doneCount +
          "/" +
          totalAll +
          " falas ja testadas.";
      } catch (e) {
        progressTxt = "";
      }
      const debugStyle = `
					.debug-form { display: flex; flex-direction: column; gap: 8px; padding: 6px 2px; color: #eee; }
					.debug-form label { color: #e8cf8a; font-weight: 600; }
					.debug-form select { max-width: 260px; }
					.debug-form .debug-progress { font-size: 12px; color: #9fd; }
				`;
      const debugContent = `
					<div class="debug-form">
						<label>Testar sons de:</label>
						<select id="npc-debug-filter">
							<option value="all">Todos</option>
							<option value="Brizola">Brizola</option>
							<option value="Minsc">Minsc</option>
						</select>
						<div class="debug-progress">${progressTxt}</div>
					</div>
				`;
      const debugButtons = [
        dialogUtils.createButton(
          "debug-start",
          "Iniciar",
          true,
          "button",
          (ev2: any, btn2: any, dlg2: any) => {
            const sel = document.getElementById(
              "npc-debug-filter",
            ) as HTMLSelectElement;
            const value = sel ? sel.value : "all";
            try {
              if (dlg2 && dlg2.close) {
                dlg2.close();
              }
            } catch (e) {}
            runAudioTest(value);
          },
        ),
        dialogUtils.createButton(
          "debug-cancel",
          "Cancelar",
          false,
          "button",
          (ev2: any, btn2: any, dlg2: any) => {
            try {
              if (dlg2 && dlg2.close) {
                dlg2.close();
              }
            } catch (e) {}
          },
        ),
      ];
      dialogUtils.createDialog(
        debugTitle,
        debugStyle,
        debugContent,
        debugButtons,
        undefined,
        undefined,
        undefined,
        360,
      );
    };
    buttons.push(
      dialogUtils.createButton(
        "debug",
        "Debug",
        false,
        "button",
        (ev: any, btn: any, dlg: any) => {
          try {
            if (dlg && dlg.close) {
              dlg.close();
            }
          } catch (e) {}
          openDebugWindow();
        },
      ),
    );

    logguer.debug("showNPCChooseDialog:20 after creating buttons");

    const selectionApp: any = dialogUtils.createDialog(
      title,
      style,
      content,
      buttons,
      undefined,
      200,
      undefined,
      400,
    );

    // R1: liga hover/clique dos cards (o render do DialogV2 e assincrono)
    const bindCards = (el: any, tries: number = 25) => {
      try {
        if (
          !el ||
          !el.querySelectorAll ||
          el.querySelectorAll(".npc-card").length === 0
        ) {
          if (tries > 0) {
            setTimeout(
              () => bindCards(selectionApp && selectionApp.element, tries - 1),
              60,
            );
          }
          return;
        }
        el.querySelectorAll(".npc-card").forEach((card: any) => {
          const label = card.getAttribute("data-npc");
          card.addEventListener("mouseenter", () => playUiSound("hover"));
          card.addEventListener("click", () => {
            playUiSound("click");
            try {
              const npcDialogCbInstance: NPCDialog = (
                injectController.has("NPCDialog")
                  ? injectController.resolve("NPCDialog")
                  : npcDialog
              ) as NPCDialog;
              const npc: NPC = injectController.resolve("npc:" + label);
              try {
                selectionApp.close();
              } catch (e) {}
              npcDialogCbInstance.callNPC(npc);
            } catch (e) {
              logguer.error("showNPCChooseDialog: clique do card falhou:", e);
            }
          });
        });
      } catch (e) {}
    };
    bindCards(selectionApp && selectionApp.element);

    // R10: abas (Home ativa nesta janela de selecao)
    try {
      npcDialogInstance.bindTabs(selectionApp, "__home__");
    } catch (e) {}

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
    const npcDialogInstance: NPCDialog = (
      injectController.has("NPCDialog")
        ? injectController.resolve("NPCDialog")
        : npcDialog
    ) as NPCDialog;
    const logguer: Log = injectController.resolve("CommonLogguer");
    logguer.debug("Selecionado ...", npc);
    npcDialogInstance.npcSelected = npc;
    // Reset por abertura (fix F7/F2): contexto e pilha limpos a CADA entrada do NPC.
    npc.groups = new Set<string>();
    npc.screens = new Array<any>();
    npc.screens.push({
      name: "root",
      callback: () => npc.startScreen(),
      type: "screen",
    });
    npc.lastSpokenIndex = null;
    await npcDialogInstance.npcSelected.startScreen();
  }

  /**
   * R10 — troca de aba: ativa o NPC SEM resetar o estado dele (groups/screens
   * preservados — herança do R4). Se a pilha estiver vazia, empilha a raiz.
   * Retorna false se o nome não corresponder a nenhum NPC registrado.
   */
  public async switchToNpc(name: string): Promise<boolean> {
    const npcDialogInstance: NPCDialog = (
      injectController.has("NPCDialog")
        ? injectController.resolve("NPCDialog")
        : npcDialog
    ) as NPCDialog;
    const logguer: Log = injectController.resolve("CommonLogguer");
    const key = Array.from(npcDialogInstance.npcs.keys()).find(
      (k) => String(k).toLowerCase() === String(name).toLowerCase(),
    );
    const npc = key ? npcDialogInstance.npcs.get(key) : undefined;
    if (!npc) {
      logguer.error("NPCDialog.switchToNpc: NPC desconhecido:", name);
      return false;
    }
    npcDialogInstance.npcSelected = npc;
    if (!npc.screens || npc.screens.length === 0) {
      npc.screens = new Array<any>();
      npc.screens.push({
        name: "root",
        callback: () => npc.startScreen(),
        type: "screen",
      });
    }
    logguer.debug("NPCDialog.switchToNpc: ativando (sem reset)", npc.name);
    const top: any = npc.screens.at(-1);
    if (top && top.callback) {
      await top.callback();
    }
    return true;
  }

  /**
   * R10 — injeta a barra de abas (Home + um botão por NPC) no topo do elemento
   * do diálogo. Idempotente por elemento (marca `data-npc-tabs="1"`).
   * O render do DialogV2 é assíncrono: tenta até 25 vezes a cada 60 ms.
   */
  public bindTabs(app: any, activeName: string): void {
    const attempt = (el: any, tries: number): void => {
      try {
        if (typeof document === "undefined") {
          return;
        }
        if (!el || !el.querySelector) {
          if (tries > 0) {
            setTimeout(() => attempt(app && app.element, tries - 1), 60);
          }
          return;
        }
        if (el.getAttribute && el.getAttribute("data-npc-tabs") === "1") {
          return;
        }
        const host =
          el.querySelector(".window-content") ||
          el.querySelector(".dialog-content") ||
          el;
        if (!host) {
          if (tries > 0) {
            setTimeout(() => attempt(app && app.element, tries - 1), 60);
          }
          return;
        }
        const logguer: Log = injectController.has("CommonLogguer")
          ? (injectController.resolve("CommonLogguer") as Log)
          : (undefined as any);
        const npcDialogInstance: NPCDialog = (
          injectController.has("NPCDialog")
            ? injectController.resolve("NPCDialog")
            : npcDialog
        ) as NPCDialog;
        const bar = document.createElement("div");
        bar.className = "npc-tabs";
        const mkBtn = (label: string, key: string, active: boolean) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "npc-tab" + (active ? " npc-tab-active" : "");
          b.textContent = label;
          b.setAttribute("data-npc-tab", key);
          b.addEventListener("click", () => {
            playUiSound("click");
            try {
              const target = key === "__home__" ? null : key;
              const current = String(activeName || "").toLowerCase();
              if (
                (target === null && current === "__home__") ||
                (target !== null && target === current)
              ) {
                return;
              }
              try {
                if (app && app.close) {
                  app.close();
                }
              } catch (e) {}
              if (target === null) {
                npcDialogInstance.showNPCChooseDialog();
              } else {
                npcDialogInstance.switchToNpc(target);
              }
            } catch (e) {
              try {
                logguer?.error("NPCDialog tabs: troca de aba falhou:", e);
              } catch (e2) {}
            }
          });
          return b;
        };
        bar.appendChild(
          mkBtn(
            "⌂",
            "__home__",
            String(activeName || "").toLowerCase() === "__home__",
          ),
        );
        npcDialogInstance.npcs.forEach((npc: NPC) => {
          bar.appendChild(
            mkBtn(
              npc.name,
              npc.name.toLowerCase(),
              npc.name.toLowerCase() === String(activeName || "").toLowerCase(),
            ),
          );
        });
        host.insertBefore(bar, host.firstChild);
        try {
          el.setAttribute("data-npc-tabs", "1");
        } catch (e) {}
      } catch (e) {}
    };
    attempt(app && app.element, 25);
  }
}
