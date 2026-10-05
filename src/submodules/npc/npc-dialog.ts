import { Log, injectController } from "taulukko-commons";
import { SubModuleBase } from "../sub-module-base";
import { DialogUtils } from "../dialog-utils/dialog-utils";
import { NPC } from "./npc";
import { NPCPortraitDialog } from "./npc-portrait-dialog";
import type { IGameContext } from "../../common/igame-context";

let npcDialog: NPCDialog | undefined = undefined;

// R10 — selo de build (diagnóstico de bundle em cache no cliente do usuário):
// console do jogo → `__npcUiBuild` deve imprimir este valor.
export const NPC_UI_BUILD = "r10v32-2026-10-05";

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
    try {
      (window as any).__npcUiBuild = NPC_UI_BUILD;
      console.log("[common-scripts] NPC UI build:", NPC_UI_BUILD);
    } catch (e) {}
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

    // R10 v3: abrir mostra o ÚLTIMO NPC ativo (memória — instância ou localStorage,
    // sem reset); só abre o hub (rail + dica) quando ninguém foi escolhido ainda.
    let lastNpcName: string | null = npcDialogInstance.npcSelected
      ? npcDialogInstance.npcSelected.name
      : null;
    if (!lastNpcName) {
      try {
        lastNpcName = localStorage.getItem("npc-last-selected");
      } catch (e) {}
    }
    if (lastNpcName) {
      logguer.debug("Botão NPCs: reabrindo último NPC ativo...", lastNpcName);
      const ok = await npcDialogInstance.switchToNpc(lastNpcName);
      if (ok) {
        return;
      }
    }

    logguer.debug("Botão NPCsespecial pressionado, mostrando diálogo...");

    const title = "NPCs Especiais";
    const style = `
					.select-npc { padding: 4px 2px; }
					`;
    // R10 v2: sem cards e sem tabs de texto — o rail lateral de fotos (bindRail)
    // é o único navegador. Direita mostra dica quando nenhum NPC está ativo.
    const content = `
					<div class="select-npc">
					<H1>NPCs Especiais</H1>
					<div class="npc-hint">← Escolha um NPC ao lado para começar.</div>
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
      540,
    );

    // R10 v2: rail lateral de fotos é o único navegador (sem cards, sem tabs).
    try {
      npcDialogInstance.bindRail(selectionApp, "");
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
    try {
      localStorage.setItem("npc-last-selected", npc.name);
    } catch (e) {}
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
    try {
      localStorage.setItem("npc-last-selected", npc.name);
    } catch (e) {}
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
   * R10 v3.1 — fecha as janelas de sistema do NPC (classe `taulukko-dialog`)
   * EXCETO a nova (`keep`), com um respiro para a nova pintar antes (sem gap).
   * REGRA DURA: só toca em janelas NOSSAS — nunca sheets, sidebar, chat ou
   * qualquer outra GUI do usuário (bug v3: varria `instances` inteiro e
   * derrubava a interface toda).
   */
  public closeOtherDialogs(keep: any): void {
    const closeOne = (w: any): void => {
      try {
        if (!w || w === keep || !w.close) {
          return;
        }
        if (w.id === "npc-portrait-dialog") {
          return;
        }
        // Só NOSSAS janelas: o elemento precisa ter a classe taulukko-dialog.
        let el: any = null;
        try {
          el = w.element;
        } catch (e) {}
        if (!el || !el.classList || !el.classList.contains("taulukko-dialog")) {
          return;
        }
        let title: string = "";
        try {
          title = String(w.title || "");
        } catch (e) {}
        if (!title) {
          try {
            title = String(
              (w.options && w.options.window && w.options.window.title) || "",
            );
          } catch (e) {}
        }
        if (!title) {
          try {
            const tn =
              el.querySelector && el.querySelector(".window-title")
                ? el.querySelector(".window-title")
                : null;
            title = tn ? String(tn.textContent || "") : "";
          } catch (e) {}
        }
        const lt = title.toLowerCase();
        if (lt.includes("confirmar fala")) {
          return;
        }
        if (title.trim() === "Debug") {
          return;
        }
        w.close();
      } catch (e) {}
    };
    try {
      setTimeout(() => {
        try {
          if (typeof foundry === "undefined" || !foundry.applications) {
            return;
          }
          (foundry.applications as any).instances.forEach(closeOne);
          Object.values(ui.windows || {}).forEach(closeOne);
        } catch (e) {}
      }, 60);
    } catch (e) {}
  }

  /**
   * R10 v3 — rail lateral de fotos (foto à esquerda + nome à direita), único
   * navegador do sistema. Layout em grid (o corpo NUNCA cai embaixo). Um
   * MutationObserver mantém o rail vivo se o DialogV2 re-renderizar o conteúdo.
   */
  public bindRail(app: any, activeName: string): void {
    const insert = (el: any): boolean => {
      try {
        if (typeof document === "undefined" || !el || !el.querySelector) {
          return false;
        }
        const host =
          el.querySelector(".window-content") ||
          el.querySelector(".dialog-content") ||
          el;
        if (!host) {
          return false;
        }
        if (host.querySelector(":scope > .npc-rail")) {
          return true;
        }
        const npcDialogInstance: NPCDialog = (
          injectController.has("NPCDialog")
            ? injectController.resolve("NPCDialog")
            : npcDialog
        ) as NPCDialog;
        const rail = document.createElement("div");
        rail.className = "npc-rail";
        npcDialogInstance.npcs.forEach((npc: NPC) => {
          const key = npc.name.toLowerCase();
          const b = document.createElement("button");
          b.type = "button";
          b.className =
            "npc-rail-item" +
            (key === String(activeName || "").toLowerCase()
              ? " npc-rail-item-active"
              : "");
          b.setAttribute("data-npc-rail-item", key);
          b.title = npc.name;
          const img = document.createElement("img");
          img.src = npc.imageUrl;
          img.alt = npc.name;
          const nm = document.createElement("span");
          nm.textContent = npc.name;
          b.appendChild(img);
          b.appendChild(nm);
          b.addEventListener("mouseenter", () => playUiSound("hover"));
          b.addEventListener("click", () => {
            playUiSound("click");
            try {
              if (key === String(activeName || "").toLowerCase()) {
                return;
              }
              npcDialogInstance.switchToNpc(key);
            } catch (e) {}
          });
          rail.appendChild(b);
        });
        const body = document.createElement("div");
        body.className = "npc-rail-body";
        Array.from(host.childNodes).forEach((k: any) => body.appendChild(k));
        host.appendChild(rail);
        host.appendChild(body);
        host.classList.add("has-rail");
        try {
          el.setAttribute("data-npc-rail", "1");
        } catch (e) {}
        return true;
      } catch (e) {
        return false;
      }
    };
    const attempt = (el: any, tries: number): void => {
      if (insert(el)) {
        try {
          const appAny: any = app;
          if (
            appAny &&
            !appAny.__npcRailMo &&
            typeof MutationObserver !== "undefined"
          ) {
            const mo = new MutationObserver(() => {
              try {
                insert(appAny.element);
              } catch (e) {}
            });
            mo.observe(appAny.element, { childList: true, subtree: true });
            appAny.__npcRailMo = mo;
          }
        } catch (e) {}
        return;
      }
      if (tries > 0) {
        setTimeout(() => attempt(app && app.element, tries - 1), 60);
      }
    };
    attempt(app && app.element, 25);
  }
}
