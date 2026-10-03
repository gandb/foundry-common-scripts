import { Log, injectController } from "taulukko-commons";
import { DialogUtils } from "../";
import type { IGameContext } from "../../common/igame-context";
import { NPCDialog } from "./";

const RANDOM_GROUP: string = "999";

export abstract class NPC {
  readonly DEFAULT_STYLE: string = `
					<style>
					.select-action { padding: 20px; background: #222; color: #eee; }
					.select-action button { margin: 5px; padding: 5px 10px; }
				`;

  actor: any;
  groups: Set<string> = new Set();
  screens = new Array<Screen | any>();
  lastSpokenIndex: number | null = null;
  lastSoundAt: number = 0;
  currentDialogApp: any = null;
  abstract groupToLines: Map<string, string>;
  abstract lines: any;

  constructor(
    public readonly name: string,
    public readonly imageUrl: string,
    public readonly formatSound: string = "ogg",
  ) {}

  async whaitFor(test: () => boolean, timeout = 60000, sleep = 100) {
    let logguer: Log | undefined = undefined;
    logguer = (
      injectController.has("CommonLogguer")
        ? injectController.resolve("CommonLogguer")
        : logguer
    ) as Log;
    if (!logguer) {
      throw new Error(
        "Required dependency 'CommonLogguer' not registered and no fallback available",
      );
    }
    let totalTime = 0;
    const ret = new Promise((resolve, reject) => {
      const handle = setInterval(() => {
        if (test()) {
          clearInterval(handle);
          resolve(undefined);
          return;
        }
        if (totalTime > timeout) {
          logguer.debug("Timeout for test:", test);
          clearInterval(handle);
          reject(new Error("timeout while wait For in common module"));
        }
        totalTime += sleep;
      }, sleep);
    });
    return ret;
  }

  public async init() {
    let npcDialogRef: NPCDialog | undefined = undefined;
    let dialogUtilsRef: DialogUtils | undefined = undefined;
    const fiveMinutes = 5 * 60 * 1000;
    await this.whaitFor(() => injectController.has("NPCDialog"), fiveMinutes);
    npcDialogRef = (
      injectController.has("NPCDialog")
        ? injectController.resolve("NPCDialog")
        : npcDialogRef
    ) as NPCDialog;
    if (!npcDialogRef) {
      throw new Error(
        "Required dependency 'NPCDialog' not registered and no fallback available",
      );
    }
    await this.whaitFor(() => injectController.has("DialogUtils"), fiveMinutes);
    dialogUtilsRef = (
      injectController.has("DialogUtils")
        ? injectController.resolve("DialogUtils")
        : dialogUtilsRef
    ) as DialogUtils;
    if (!dialogUtilsRef) {
      throw new Error(
        "Required dependency 'DialogUtils' not registered and no fallback available",
      );
    }

    const npcDialog: NPCDialog = (
      injectController.has("NPCDialog")
        ? injectController.resolve("NPCDialog")
        : npcDialogRef
    ) as NPCDialog;
    this.screens.push({
      name: "npc-dialog",
      callback: npcDialog.showNPCChooseDialog,
    });
  }
  public decrementGroup() {
    let npcDialogRef: NPCDialog | undefined = undefined;
    const npcDialog: NPCDialog = (
      injectController.has("NPCDialog")
        ? injectController.resolve("NPCDialog")
        : npcDialogRef
    ) as NPCDialog;
    if (!npcDialog) {
      throw new Error(
        "Required dependency 'NPCDialog' not registered and no fallback available",
      );
    }
    const array = [...this.groups];
    const newArray = array.slice(0, -1);
    this.groups = new Set(newArray);
  }

  public getAlias() {
    let npcDialogRef: NPCDialog | undefined = undefined;
    const npcDialog: NPCDialog = (
      injectController.has("NPCDialog")
        ? injectController.resolve("NPCDialog")
        : npcDialogRef
    ) as NPCDialog;
    if (!npcDialog) {
      throw new Error(
        "Required dependency 'NPCDialog' not registered and no fallback available",
      );
    }
    return this.name.toLocaleLowerCase();
  }

  public async createDialog(
    title: string,
    content: string,
    options: Array<any>,
    buttons: Array<any> | null = null,
  ) {
    let npcDialogRef: NPCDialog | undefined = undefined;
    let dialogUtilsRef: DialogUtils | undefined = undefined;
    let loguerRef: Log | undefined = undefined;
    const npcDialog: NPCDialog = (
      injectController.has("NPCDialog")
        ? injectController.resolve("NPCDialog")
        : npcDialogRef
    ) as NPCDialog;
    if (!npcDialog) {
      throw new Error(
        "Required dependency 'NPCDialog' not registered and no fallback available",
      );
    }
    const dialogUtils: DialogUtils = (
      injectController.has("DialogUtils")
        ? injectController.resolve("DialogUtils")
        : dialogUtilsRef
    ) as DialogUtils;
    if (!dialogUtils) {
      throw new Error(
        "Required dependency 'DialogUtils' not registered and no fallback available",
      );
    }
    const loguer: Log = (
      injectController.has("CommonLogguer")
        ? injectController.resolve("CommonLogguer")
        : loguerRef
    ) as Log;
    if (!loguer) {
      throw new Error(
        "Required dependency 'CommonLogguer' not registered and no fallback available",
      );
    }
    const alias = this.getAlias();

    let appInstance: any = null;

    let innerContent = `
		<DIV class="${alias}-actions-buttons">
			<SELECT>
				<option selected="selected" value="${alias}-random">Aleatório dado o contexto até aqui</option>
		`;

    options.forEach((option) => {
      const backAction: string = `${alias}-back`;
      const sendAction: string = `${alias}-send`;
      const cancelction: string = `${alias}-cancel`;

      if (
        option.action == backAction ||
        option.action == sendAction ||
        option.action == cancelction
      ) {
        return;
      }

      loguer.debug("NPC.createDialog:5 for,button:", option);

      innerContent += `
				<option value="${option.action}">${option.label} </option>
			`;
    });

    innerContent += `
			</SELECT>
		</DIV>
		`;

    loguer.debug("NPC.createDialog:10", options);
    loguer.debug("NPC.createDialog:15:npcSelected.groups:", this.groups);

    if (!buttons) {
      loguer.debug("NPC.createDialog:20");

      buttons = [
        dialogUtils.createButton("send", "Enviar", true, "action", async () => {
          loguer.debug("NPC.createDialog, before creating send:", this.groups);

          loguer.debug("NPC.createDialog [10]: Escolhido a opcao enviar");

          const rootEl: any =
            appInstance && appInstance.element ? appInstance.element : document;
          const queryResult =
            (rootEl.querySelector(
              `.${alias}-actions-buttons SELECT`,
            ) as HTMLSelectElement) || null;
          const result = queryResult?.value;

          if (result === null || result === undefined) {
            loguer.error("NPC.createDialog: Erro ao obter a opcao selecionada");
            return;
          }

          loguer.debug(
            "NPC.createDialog [20]: depois de selecionar o resultado",
            result,
          );

          if (result === `${alias}-random`) {
            const lastScreen = this.screens.at(-1);
            this.screens.push({
              name: result,
              callback: () => this.send(),
              type: lastScreen.type,
            });
            loguer.debug("NPC.createDialog, before  random send:", this.groups);
            this.send(false);
            loguer.debug("NPC.createDialog, after random send:", this.groups);

            return;
          }
          options.forEach((button) => {
            if (button.action != result) {
              return;
            }

            loguer.debug("NPC.Enviado a opcao :" + result);
            const entry: any = {
              name: result,
              callback: button.callback,
              type: button.type,
              addedGroups: [] as string[],
            };
            const beforeGroups: Set<string> = new Set(this.groups);
            this.screens.push(entry);
            const recoverActionError = (err: any) => {
              loguer.error(
                "NPC.createDialog: erro ao executar a acao - recuperando a UI:",
                err,
              );
              try {
                ui.notifications?.error(
                  "Erro ao executar a ação: " + (err?.message || err),
                );
              } catch (e) {}
              if (this.screens.at(-1) === entry) {
                this.screens.pop();
              }
              this.groups = beforeGroups;
              const top: any = this.screens.at(-1);
              try {
                if (top && top.callback) {
                  top.callback();
                }
              } catch (e) {
                try {
                  this.startScreen();
                } catch (e2) {}
              }
            };
            try {
              const maybePromise: any = button.callback();
              if (maybePromise && typeof maybePromise.then === "function") {
                maybePromise.catch(recoverActionError);
              }
              entry.addedGroups = Array.from(this.groups as Set<string>).filter(
                (g: string) => !beforeGroups.has(g),
              );
            } catch (err) {
              recoverActionError(err);
            }
            loguer.debug(
              "NPC.createDialog, after 3 creating send:",
              this.groups,
            );
          });
        }),
        dialogUtils.createButton("back", "Voltar", true, "action", async () => {
          loguer.debug("NPC.screens ao voltar - antes: ", this.screens);

          const previousLastScreen: any = this.screens.at(-2);
          const lastScreen: any = this.screens.pop();
          loguer.debug("lastScreen:", lastScreen);
          loguer.debug("screens ao voltar - depois: ", this.screens);

          if (
            lastScreen &&
            lastScreen.addedGroups &&
            lastScreen.addedGroups.length > 0
          ) {
            lastScreen.addedGroups.forEach((g: string) =>
              this.groups.delete(g),
            );
          } else if (lastScreen && lastScreen.type == "screen-context") {
            this.decrementGroup();
          }

          if (previousLastScreen && previousLastScreen.callback) {
            previousLastScreen.callback();
          }
        }),
        dialogUtils.createButton(
          "cancel",
          "Cancelar",
          true,
          "action",
          async () => {
            loguer.debug("NPC.Cancelado a tela do ", alias);
          },
        ),
      ];

      loguer.debug("NPC.createDialog:25. Create submits", buttons);

      loguer.debug("NPC.createDialog:30 - depois de criar submits");
    }

    const submit = (
      action: string,
      label: string,
      defaultValue: string,
      callback: any,
    ) => {};

    loguer.debug("NPC.createDialog:40 - antes de criar dialogo");

    appInstance = dialogUtils.createDialog(
      title,
      this.DEFAULT_STYLE,
      innerContent,
      buttons,
      submit,
      200,
      undefined,
      400,
    );

    // R4: cada NPC tem a SUA janela — ao reabrir, fecha a janela ANTERIOR deste NPC
    // (nao toca nas janelas dos outros NPCs).
    try {
      const previous: any = this.currentDialogApp;
      if (previous && previous !== appInstance && previous.close) {
        previous.close();
      }
    } catch (e) {}
    this.currentDialogApp = appInstance;

    loguer.debug("NPC.createDialog:50 - depois de criar dialogo");
  }

  public abstract startScreen(): Promise<void>;

  public async getListLinesFromGroup(groupsUnordered: any) {
    let npcDialogRef: NPCDialog | undefined = undefined;
    let loguerRef: Log | undefined = undefined;
    const npcDialog: NPCDialog = (
      injectController.has("NPCDialog")
        ? injectController.resolve("NPCDialog")
        : npcDialogRef
    ) as NPCDialog;
    if (!npcDialog) {
      throw new Error(
        "Required dependency 'NPCDialog' not registered and no fallback available",
      );
    }
    const loguer: Log = (
      injectController.has("CommonLogguer")
        ? injectController.resolve("CommonLogguer")
        : loguerRef
    ) as Log;
    if (!loguer) {
      throw new Error(
        "Required dependency 'CommonLogguer' not registered and no fallback available",
      );
    }

    const groups = Array.from(groupsUnordered)
      .map(Number)
      .sort((a, b) => a - b);

    if (groups.length === 0 && groupsUnordered.size === 0) {
      return new Array();
    }

    if (groups.length === 0) {
      groups.push(Number.parseInt(groupsUnordered.get(0), 10));
    }

    if (groups.length == 1) {
      return groups;
    }

    let combinations = await this.getCombinations(groups);
    loguer.debug("groups:", groups);
    loguer.debug("keys:", combinations);

    return combinations;
  }

  public async getCombinations(
    numbers: Array<number>,
    separator: string = ";",
  ) {
    let npcDialogRef: NPCDialog | undefined = undefined;
    let loguerRef: Log | undefined = undefined;
    const npcDialog: NPCDialog = (
      injectController.has("NPCDialog")
        ? injectController.resolve("NPCDialog")
        : npcDialogRef
    ) as NPCDialog;
    if (!npcDialog) {
      throw new Error(
        "Required dependency 'NPCDialog' not registered and no fallback available",
      );
    }
    const loguer: Log = (
      injectController.has("CommonLogguer")
        ? injectController.resolve("CommonLogguer")
        : loguerRef
    ) as Log;
    if (!loguer) {
      throw new Error(
        "Required dependency 'CommonLogguer' not registered and no fallback available",
      );
    }

    const ret = new Array();

    if (numbers.length == 0 || numbers.length == 1) {
      return [...numbers];
    }

    loguer.debug("numbers:", numbers);

    const generate = (start: number, path: Array<number>) => {
      loguer.debug("generate start:", start, ",path", path);

      let combinationKey = numbers.join(";");
      loguer.debug("combinationKey:", combinationKey);

      loguer.debug(
        "groupToLines:",
        this.groupToLines,
        "-",
        typeof combinationKey,
      );

      if (this.groupToLines.has(combinationKey)) {
        loguer.debug("find, return the combination");
        ret.push(combinationKey);
        return ret;
      }
      loguer.debug("combinationKey not found:", combinationKey);
      for (let i = start; i < numbers.length; i++) {
        const newCombinationGroup: Array<number> = [...path, numbers[i]];
        loguer.debug("novaCombinacao:", newCombinationGroup);
        combinationKey = newCombinationGroup.join(";");
        ret.push(combinationKey);
        generate(i + 1, newCombinationGroup);
      }
    };

    generate(0, []);
    return ret;
  }

  public async speak(lineIndex: number) {
    let npcDialogRef: NPCDialog | undefined = undefined;
    let loguerRef: Log | undefined = undefined;
    let gameContextRef: IGameContext | undefined = undefined;
    const npcDialog: NPCDialog = (
      injectController.has("NPCDialog")
        ? injectController.resolve("NPCDialog")
        : npcDialogRef
    ) as NPCDialog;
    if (!npcDialog) {
      throw new Error(
        "Required dependency 'NPCDialog' not registered and no fallback available",
      );
    }
    const loguer: Log = (
      injectController.has("CommonLogguer")
        ? injectController.resolve("CommonLogguer")
        : loguerRef
    ) as Log;
    if (!loguer) {
      throw new Error(
        "Required dependency 'CommonLogguer' not registered and no fallback available",
      );
    }

    const line = this.lines[lineIndex];

    loguer.debug("speak:talk:", line);

    loguer.debug("disparando o evento pra todo mundo:");

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

    // Cria uma mensagem invisível que todos recebem
    await ChatMessage.create({
      content: "NPC Portrait Event", // Invisível pra maioria
      whisper: Array.from(
        (
          gameContext.users as {
            values(): IterableIterator<{ id: string }>;
          } | null
        )?.values() || [],
      ).map((u: { id: string }) => u.id),
      flags: {
        "npc-talk": {
          type: "npcDialogOnTalk",
          payload: {
            imageUrl: this.imageUrl,
            npcName: this.name,
            dialogText: line,
          },
        },
      },
    });

    //com socket nao funcionou
    /*
		if (game.user?.isGM) {
			(game.socket as any).emit('forgotten-realms', {
				type: 'npcDialogOnTalk',
				data: {imageUrl:this.imageUrl,npcName:this.name,dialogText:line},
			});
		} 
			*/

    //com hooks nao funcionou
    //Hooks.callAll('npcDialogOnTalk',  {imageUrl:this.imageUrl,npcName:this.name,dialogText:line});

    loguer.debug(" evento disparado pra todo mundo:");

    const formatedIndex = lineIndex.toString().padStart(3, "0");
    const name = this.name;
    const src = `modules/forgotten-realms/sounds/npcs/${name}/${formatedIndex}/${name}${formatedIndex}.${this.formatSound}`;
    const ret = await this.playSoundWithNoEffect(src);
    loguer.debug("Retorno do play:", ret);
  }

  private async playSoundWithNoEffect(src: string): Promise<boolean> {
    let npcDialogRef: NPCDialog | undefined = undefined;
    let loguerRef: Log | undefined = undefined;
    const npcDialog: NPCDialog = (
      injectController.has("NPCDialog")
        ? injectController.resolve("NPCDialog")
        : npcDialogRef
    ) as NPCDialog;
    if (!npcDialog) {
      throw new Error(
        "Required dependency 'NPCDialog' not registered and no fallback available",
      );
    }
    const loguer: Log = (
      injectController.has("CommonLogguer")
        ? injectController.resolve("CommonLogguer")
        : loguerRef
    ) as Log;
    if (!loguer) {
      throw new Error(
        "Required dependency 'CommonLogguer' not registered and no fallback available",
      );
    }
    try {
      const response = await fetch(src, { method: "HEAD" });
      if (!response.ok) {
        console.warn(`Arquivo não encontrado: ${src} (${response.status})`);
        return false;
      }

      // R3 — trava de seguranca: nao disparar 2 sons do MESMO NPC em menos de 5s
      // (protege contra bugs de repeticao; testes usam window.__npcSoundLockBypass).
      const now = Date.now();
      const bypass = (window as any).__npcSoundLockBypass === true;
      if (!bypass && this.lastSoundAt && now - this.lastSoundAt < 5000) {
        loguer.debug(
          "NPC.playSoundWithNoEffect: som bloqueado pela trava de 5s do mesmo NPC",
        );
        return false;
      }

      foundry.audio.AudioHelper.play({ src, autoplay: true }, true);
      this.lastSoundAt = now;
      return true;
    } catch (error: any) {
      loguer.error("Erro ao reproduzir o som:", src, error);
      return false;
    }
  }

  public async send(removeLastGroup = true) {
    let npcDialogRef: NPCDialog | undefined = undefined;
    let loguerRef: Log | undefined = undefined;
    const npcDialog: NPCDialog = (
      injectController.has("NPCDialog")
        ? injectController.resolve("NPCDialog")
        : npcDialogRef
    ) as NPCDialog;
    if (!npcDialog) {
      throw new Error(
        "Required dependency 'NPCDialog' not registered and no fallback available",
      );
    }
    const loguer: Log = (
      injectController.has("CommonLogguer")
        ? injectController.resolve("CommonLogguer")
        : loguerRef
    ) as Log;
    if (!loguer) {
      throw new Error(
        "Required dependency 'CommonLogguer' not registered and no fallback available",
      );
    }
    if (this.groups.size === 0) {
      this.groups.add(RANDOM_GROUP);
    }

    const list0 = await this.getListLinesFromGroup(this.groups);
    // Preferencia pelo contexto CLICADO: se a ultima acao adicionou grupo(s),
    // prioriza combinacoes que os incluem (fala certa do botao clicado).
    let list = list0;
    try {
      const lastEntry: any = this.screens.at(-1);
      const clicked: string[] = (lastEntry && lastEntry.addedGroups) || [];
      if (clicked.length > 0 && Array.isArray(list0)) {
        const preferred = list0.filter((k: any) =>
          String(k)
            .split(";")
            .some((x: string) => clicked.includes(String(Number(x)))),
        );
        if (preferred.length > 0) {
          list = preferred;
        }
      }
    } catch (e) {}

    loguer.debug("NPC.send, before send,list:", list);

    const lines = new Array();

    for (const groupNumber of list) {
      const group = groupNumber.toString();
      loguer.debug("group:", group);
      if (!this.groupToLines.has(group)) {
        loguer.warn(
          `NPC.send, afterSend:Grupo ${group} não encontrado em groupToLines!`,
        );
        continue;
      }

      const size = group.split(";").length + 1;

      const linesForThisGroupConcat: string = this.groupToLines.get(
        group,
      ) as string;
      loguer.debug(
        "NPC.send, 50,linesForThisGroupConcat:",
        linesForThisGroupConcat,
        "-size:",
        size,
      );

      const linesForThisGroup = linesForThisGroupConcat.split(";");
      loguer.debug("NPC.send, 60,linesForThisGroup:", linesForThisGroup);
      linesForThisGroup.forEach((line) => {
        for (let i = 0; i < size; i++) {
          lines.push(line);
        }
      });
    }

    loguer.debug("NPC.send, afterSend,lines:", lines);

    let randomIndex = Math.abs(Math.round(Math.random() * lines.length));
    randomIndex = randomIndex >= lines.length ? lines.length - 1 : randomIndex;

    loguer.debug("NPC.send, afterSend,randomIndex:", randomIndex);

    let lineIndex = Number.parseInt(lines[randomIndex], 10);

    // Anti-repeticao: evita entregar a MESMA fala em acoes seguidas
    // quando existe alternativa (lastSpokenIndex por NPC).
    if (this.lastSpokenIndex === lineIndex && lines.length > 1) {
      for (let attempt = 0; attempt < 6; attempt++) {
        const retryRaw = Math.abs(Math.round(Math.random() * lines.length));
        const retryIndex = Number.parseInt(
          lines[retryRaw >= lines.length ? lines.length - 1 : retryRaw],
          10,
        );
        if (retryIndex !== lineIndex) {
          lineIndex = retryIndex;
          break;
        }
      }
    }
    this.lastSpokenIndex = lineIndex;

    loguer.debug("NPC.send, afterSend,lineIndex:", lineIndex);

    this.speak(lineIndex);

    loguer.debug("NPC.send, afterSend,activeScreen:", this.screens);

    const actEntry: any = this.screens.at(-1);
    const activeScreen: any = this.screens.at(-2);
    this.screens.pop();

    if (activeScreen && activeScreen.callback) {
      activeScreen.callback();
    }

    this.groups.delete(RANDOM_GROUP);

    if (removeLastGroup) {
      const added: string[] = (actEntry && actEntry.addedGroups) || [];
      if (added.length > 0) {
        added.forEach((g: string) => this.groups.delete(g));
      } else {
        this.decrementGroup();
      }
    }

    loguer.debug("NPC.send, afterSend:", this.groups);
  }
}
