import { Log, injectController } from "taulukko-commons";
import { DialogUtils } from "../";
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
  abstract groupToLines: Map<string, string>;
  abstract lines: any;

  constructor(
    public readonly name: string,
    public readonly imageUrl: string,
    public readonly formatSound: string = "ogg",
  ) {}

  async whaitFor(test: () => boolean, timeout = 60000, sleep = 100) {
    const logguer: Log = injectController.resolve("CommonLogguer");
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
    const fiveMinutes = 5 * 60 * 1000;
    await this.whaitFor(
      () => injectController.resolve("NPCDialog"),
      fiveMinutes,
    );
    if (!injectController.resolve("NPCDialog")) {
      throw new Error("Timeout waiting for hooks");
    }
    await this.whaitFor(
      () => injectController.resolve("DialogUtils"),
      fiveMinutes,
    );
    if (!injectController.resolve("DialogUtils")) {
      throw new Error("Timeout waiting for hooks");
    }

    const npcDialog: NPCDialog = injectController.resolve("NPCDialog");
    this.screens.push({
      name: "npc-dialog",
      callback: npcDialog.showNPCChooseDialog,
    });
  }
  public decrementGroup() {
    const npcDialog: NPCDialog = injectController.resolve("NPCDialog");
    const array = [...npcDialog.npcSelected.groups];
    const newArray = array.slice(0, -1);
    npcDialog.npcSelected.groups = new Set(newArray);
  }

  public getAlias() {
    return this.name.toLocaleLowerCase();
  }

  public async createDialog(
    title: string,
    content: string,
    options: Array<any>,
    buttons: Array<any> | null,
  ) {
    const npcDialog: NPCDialog = injectController.resolve("NPCDialog");
    const dialogUtils: DialogUtils = injectController.resolve("DialogUtils");
    const loguer: Log = injectController.resolve("CommonLogguer");
    const alias = npcDialog.npcSelected.getAlias();

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
    loguer.debug(
      "NPC.createDialog:15:npcSelected.groups:",
      npcDialog.npcSelected.groups,
    );

    if (!buttons) {
      loguer.debug("NPC.createDialog:20");

      buttons = [
        dialogUtils.createButton("send", "Enviar", true, "action", async () => {
          loguer.debug(
            "NPC.createDialog, before creating send:",
            npcDialog.npcSelected.groups,
          );

          loguer.debug("NPC.createDialog [10]: Escolhido a opcao enviar");

          const queryResult =
            (document.querySelector(
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
            const lastScreen = npcDialog.npcSelected.screens.at(-1);
            npcDialog.npcSelected.screens.push({
              name: result,
              callback: npcDialog.npcSelected.send,
              type: lastScreen.type,
            });
            loguer.debug(
              "NPC.createDialog, before  random send:",
              npcDialog.npcSelected.groups,
            );
            npcDialog.npcSelected.send(false);
            loguer.debug(
              "NPC.createDialog, after random send:",
              npcDialog.npcSelected.groups,
            );

            return;
          }
          options.forEach((button) => {
            if (button.action != result) {
              return;
            }

            loguer.debug("NPC.Enviado a opcao :" + result);
            npcDialog.npcSelected.screens.push({
              name: result,
              callback: button.callback,
              type: button.type,
            });
            button.callback();
            loguer.debug(
              "NPC.createDialog, after 3 creating send:",
              npcDialog.npcSelected.groups,
            );
          });
        }),
        dialogUtils.createButton("back", "Voltar", true, "action", async () => {
          loguer.debug(
            "NPC.screens ao voltar - antes: ",
            npcDialog.npcSelected.screens,
          );

          const previousLastScreen = npcDialog.npcSelected.screens.at(-2);
          const lastScreen = npcDialog.npcSelected.screens.pop();
          loguer.debug("lastScreen:", lastScreen);
          loguer.debug(
            "screens ao voltar - depois: ",
            npcDialog.npcSelected.screens,
          );

          if (lastScreen.type == "screen-context") {
            npcDialog.npcSelected.decrementGroup();
          }

          previousLastScreen.callback();
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

    dialogUtils.createDialog(
      title,
      npcDialog.npcSelected.DEFAULT_STYLE,
      innerContent,
      buttons,
      submit,
      200,
      undefined,
      400,
    );

    loguer.debug("NPC.createDialog:50 - depois de criar dialogo");
  }

  public abstract startScreen(): Promise<void>;

  public async getListLinesFromGroup(groupsUnordered: any) {
    const npcDialog: NPCDialog = injectController.resolve("NPCDialog");
    const loguer: Log = injectController.resolve("CommonLogguer");

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

    let combinations = await npcDialog.npcSelected.getCombinations(groups);
    loguer.debug("groups:", groups);
    loguer.debug("keys:", combinations);

    return combinations;
  }

  public async getCombinations(
    numbers: Array<number>,
    separator: string = ";",
  ) {
    const npcDialog: NPCDialog = injectController.resolve("NPCDialog");
    const loguer: Log = injectController.resolve("CommonLogguer");

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
        npcDialog.npcSelected.groupToLines,
        "-",
        typeof combinationKey,
      );

      if (npcDialog.npcSelected.groupToLines.has(combinationKey)) {
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
    const npcDialog: NPCDialog = injectController.resolve("NPCDialog");
    const loguer: Log = injectController.resolve("CommonLogguer");

    const line = npcDialog.npcSelected.lines[lineIndex];

    loguer.debug("speak:talk:", line);

    loguer.debug("disparando o evento pra todo mundo:");

    // Cria uma mensagem invisível que todos recebem
    await ChatMessage.create({
      content: "NPC Portrait Event", // Invisível pra maioria
      whisper: Array.from(game.users?.values() || []).map((u: any) => u.id),
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
    const name = npcDialog.npcSelected.name;
    const src = `modules/forgotten-realms/sounds/npcs/${name}/${formatedIndex}/${name}${formatedIndex}.${npcDialog.npcSelected.formatSound}`;
    const ret = await this.playSoundWithNoEffect(src);
    loguer.debug("Retorno do play:", ret);
  }

  private async playSoundWithNoEffect(src: string): Promise<boolean> {
    const npcDialog: NPCDialog = injectController.resolve("NPCDialog");
    const loguer: Log = injectController.resolve("CommonLogguer");
    try {
      const response = await fetch(src, { method: "HEAD" });
      if (!response.ok) {
        console.warn(`Arquivo não encontrado: ${src} (${response.status})`);
        return false;
      }

      foundry.audio.AudioHelper.play({ src, autoplay: true }, true);
      return true;
    } catch (error: any) {
      loguer.error("Erro ao reproduzir o som:", src, error);
      return false;
    }
  }

  public async send(removeLastGroup = true) {
    const npcDialog: NPCDialog = injectController.resolve("NPCDialog");
    const loguer: Log = injectController.resolve("CommonLogguer");
    if (npcDialog.npcSelected.groups.size === 0) {
      npcDialog.npcSelected.groups.add(RANDOM_GROUP);
    }

    const list = await npcDialog.npcSelected.getListLinesFromGroup(
      npcDialog.npcSelected.groups,
    );

    loguer.debug("NPC.send, before send,list:", list);

    const lines = new Array();

    for (const groupNumber of list) {
      const group = groupNumber.toString();
      loguer.debug("group:", group);
      if (!npcDialog.npcSelected.groupToLines.has(group)) {
        loguer.warn(
          `NPC.send, afterSend:Grupo ${group} não encontrado em groupToLines!`,
        );
        continue;
      }

      const size = group.split(";").length + 1;

      const linesForThisGroupConcat: string =
        npcDialog.npcSelected.groupToLines.get(group);
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

    const lineIndex = Number.parseInt(lines[randomIndex], 10);

    loguer.debug("NPC.send, afterSend,lineIndex:", lineIndex);

    npcDialog.npcSelected.speak(lineIndex);

    loguer.debug(
      "NPC.send, afterSend,activeScreen:",
      npcDialog.npcSelected.screens,
    );

    const activeScreen = npcDialog.npcSelected.screens.at(-2);
    npcDialog.npcSelected.screens.pop();

    activeScreen.callback();

    npcDialog.npcSelected.groups.delete(RANDOM_GROUP);

    if (removeLastGroup) {
      npcDialog.npcSelected.decrementGroup();
    }

    loguer.debug("NPC.send, afterSend:", npcDialog.npcSelected.groups);
  }
}
