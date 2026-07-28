import { Log, injectController } from "taulukko-commons";
import { ModuleBase } from "./common";
import type { IGameContext, IGameSettings } from "./common/igame-context";
import type { IFoundryAPI } from "./common/ifoundry-api"; // Caminho corrigido
import {
  SubModuleBase,
  RegionUtils,
  PlayersTools,
  HideUnidentify,
  DialogUtils,
} from "./submodules";
//import { DummySocket } from "./sockets/implementations/common-socket-dummy";
import { SocketLib } from "./sockets/implementations/common-socket-socketlib";
import { NPCDialog } from "./submodules";
import { FlightMovement } from "./submodules/flight-movement/flight-movement";
import { socketTest } from "./sockets/common-socket-test";
import { Socket } from "./sockets";
import { FoundryAPI } from "./common/foundry-api";

const COMMON_REGISTERED_NAMES = {
  MODULE_VERSION: "common-assets-version",
};

const doc: FoundryDocument = document as FoundryDocument;

let commonModule: CommonModule | undefined = undefined;

export class CommonModule extends ModuleBase {
  public readonly name: string = "common-scripts-dnd5ed";
  public readonly version: string = "2.0.1";
  public readonly startVersion: string = "";
  #debug: boolean = true;
  #hooksRequiredLoaded: boolean = false;

  public get hooksRequiredLoaded(): boolean {
    return this.#hooksRequiredLoaded;
  }

  public set hooksRequiredLoaded(val: boolean) {
    this.#hooksRequiredLoaded = val;
  }

  public async addInitCommonAssetsChanges() {
    let logguerRef: Log | undefined = undefined;
    const logguer: Log = (
      injectController.has("CommonLogguer")
        ? injectController.resolve("CommonLogguer")
        : logguerRef
    ) as Log;
    if (!logguer) {
      throw new Error(
        "Required dependency 'CommonLogguer' not registered and no fallback available",
      );
    }
    commonModule = injectController.has("CommonModule")
      ? injectController.resolve("CommonModule")
      : (commonModule as CommonModule);

    logguer.debug(
      "addInitCommonAssetsChanges:20,register  commnModule:",
      commonModule,
    );

    await (commonModule as CommonModule).registerSetting(
      COMMON_REGISTERED_NAMES.MODULE_VERSION,
    );
  }

  public async init() {
    await super.init();
  }

  private async loadSubModules() {
    const subModules: Array<SubModuleBase> = new Array();

    subModules.push(
      new RegionUtils(),
      new NPCDialog(),
      new PlayersTools(),
      new DialogUtils(),
      new HideUnidentify(),
      new FlightMovement(),
    );

    for (const subModule of subModules) {
      injectController.registerByClass(subModule);
      await subModule.init();
      const logguer: Log = injectController.resolve("CommonLogguer");
      logguer.debug("Submodule loaded : ", subModule);
    }

    //choose implementation dependes what I want
    const commonSocket: Socket = new SocketLib(); // new DummySocket();
    injectController.registerByName("Socket", commonSocket);
  }

  protected async waitReady() {
    let logguerRef: Log | undefined = undefined;
    let commonModuleRef: CommonModule | undefined = undefined;
    const logguer: Log = (
      injectController.has("CommonLogguer")
        ? injectController.resolve("CommonLogguer")
        : logguerRef
    ) as Log;
    if (!logguer) {
      throw new Error(
        "Required dependency 'CommonLogguer' not registered and no fallback available",
      );
    }
    const commonModule: CommonModule = (
      injectController.has("CommonModule")
        ? injectController.resolve("CommonModule")
        : commonModuleRef
    ) as CommonModule;
    const foundry: IFoundryAPI = injectController.has("FoundryAPI")
      ? injectController.resolve("FoundryAPI")
      : new FoundryAPI();

    if (!injectController.has("FoundryAPI")) {
      injectController.registerByName("FoundryAPI", foundry);
    }

    const fiveMinutes = 5 * 60 * 1000;
    await commonModule.whaitFor(
      () => commonModule.hooksRequiredLoaded,
      fiveMinutes,
    );
    if (!commonModule.hooksRequiredLoaded) {
      throw new Error("Timeout waiting for hooks");
    }

    logguer.debug("Módulo Common Assets waitReady finish with success.");

    foundry.hooks.callAll("onReadyCommonModule", {});
  }

  protected async initHooks() {
    let commonModuleRef: CommonModule | undefined = undefined;
    const commonModule: CommonModule = (
      injectController.has("CommonModule")
        ? injectController.resolve("CommonModule")
        : commonModuleRef
    ) as CommonModule;
    if (!commonModule) {
      throw new Error(
        "Required dependency 'CommonModule' not registered and no fallback available",
      );
    }
    const foundry: IFoundryAPI | undefined = injectController.has("FoundryAPI")
      ? injectController.resolve("FoundryAPI")
      : undefined;

    commonModule.loadSubModules().then(() => {
      let logguerRef: Log | undefined = undefined;
      const logguer: Log = (
        injectController.has("CommonLogguer")
          ? injectController.resolve("CommonLogguer")
          : logguerRef
      ) as Log;
      if (!logguer) {
        throw new Error(
          "Required dependency 'CommonLogguer' not registered and no fallback available",
        );
      }
      logguer.info("All submodules from common modules loaded with success");
    });

    if (!foundry) {
      Hooks.once("init", async () => {
        let logguerRef: Log | undefined = undefined;
        const logguer: Log = (
          injectController.has("CommonLogguer")
            ? injectController.resolve("CommonLogguer")
            : logguerRef
        ) as Log;
        if (!logguer) {
          throw new Error(
            "Required dependency 'CommonLogguer' not registered and no fallback available",
          );
        }
        logguer.info("Módulo Common Assets inicalizando 2...");
        await commonModule.addInitCommonAssetsChanges();
      });

      Hooks.once("ready", async () => {
        let logguerRef: Log | undefined = undefined;
        const logguer: Log = (
          injectController.has("CommonLogguer")
            ? injectController.resolve("CommonLogguer")
            : logguerRef
        ) as Log;
        if (!logguer) {
          throw new Error(
            "Required dependency 'CommonLogguer' not registered and no fallback available",
          );
        }
        logguer.info("Common Module ready! Version: " + commonModule.version);
      });
      return;
    }

    foundry.hooks.once("init", async () => {
      let commonModuleRef: CommonModule | undefined = undefined;
      const commonModule: CommonModule = (
        injectController.has("CommonModule")
          ? injectController.resolve("CommonModule")
          : commonModuleRef
      ) as CommonModule;
      if (!commonModule) {
        throw new Error(
          "Required dependency 'CommonModule' not registered and no fallback available",
        );
      }
      let logguerRef: Log | undefined = undefined;
      const logguer: Log = (
        injectController.has("CommonLogguer")
          ? injectController.resolve("CommonLogguer")
          : logguerRef
      ) as Log;
      if (!logguer) {
        throw new Error(
          "Required dependency 'CommonLogguer' not registered and no fallback available",
        );
      }

      logguer.info("Módulo Common Assets inicalizando 2...", commonModule);
      await commonModule.addInitCommonAssetsChanges();
    });

    foundry.hooks.once("ready", async () => {
      let commonModuleRef: CommonModule | undefined = undefined;
      const commonModule: CommonModule = (
        injectController.has("CommonModule")
          ? injectController.resolve("CommonModule")
          : commonModuleRef
      ) as CommonModule;
      if (!commonModule) {
        throw new Error(
          "Required dependency 'CommonModule' not registered and no fallback available",
        );
      }
      let logguerRef: Log | undefined = undefined;
      const logguer: Log = (
        injectController.has("CommonLogguer")
          ? injectController.resolve("CommonLogguer")
          : logguerRef
      ) as Log;
      if (!logguer) {
        throw new Error(
          "Required dependency 'CommonLogguer' not registered and no fallback available",
        );
      }

      const gameContext: IGameContext | undefined = injectController.has(
        "GameContext",
      )
        ? (injectController.resolve("GameContext") as IGameContext)
        : undefined;
      if (gameContext?.user?.isGM) {
        logguer.debug("GM detected, adding isGM class to body");
        document.body.classList.add("isGM");
      }

      logguer.debug(
        `Getting the old version with key:${COMMON_REGISTERED_NAMES.MODULE_VERSION}`,
      );

      const instalatedVersion = await commonModule.getSettings(
        COMMON_REGISTERED_NAMES.MODULE_VERSION,
      );

      await commonModule.addReadyCommonAssetsChanges();

      //debug only
      socketTest();

      commonModule.hooksRequiredLoaded = true;

      if (instalatedVersion === commonModule.version) {
        logguer.info(
          `Módulo Common Assets v.${commonModule.version} carregado com sucesso!`,
        );
        return;
      }

      await commonModule.updateVersions(
        instalatedVersion as string,
        commonModule.version,
      );

      //FIM DE ATUALIZAÇÃO DE VERSÃO
      logguer.info(
        `Módulo Common Assets atualizado de ${instalatedVersion} para ${commonModule.version} e carregado com sucesso!`,
      );
    });
  }

  public async addReadyCommonAssetsChanges() {
    let logguerRef: Log | undefined = undefined;
    const logguer: Log = (
      injectController.has("CommonLogguer")
        ? injectController.resolve("CommonLogguer")
        : logguerRef
    ) as Log;
    if (!logguer) {
      throw new Error(
        "Required dependency 'CommonLogguer' not registered and no fallback available",
      );
    }

    const injectButton = () => {
      let el = doc.getElementById("roll-privacy");
      if (!el) {
        el = doc.getElementById("message-modes");
      }
      if (!el) return;
      if (el.querySelector(".common-assets-help")) return;

      const botao = doc.createElement("button");
      botao.textContent = "?";
      botao.className = "ui-control icon fa-solid fa-help common-assets-help";
      botao.addEventListener("click", (event) => {
        event.preventDefault();
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
        const journal = (
          gameContext.journal as { getName(name: string): unknown }
        ).getName("Como Rolar Dados");
        logguer.info("Mensagem exibida ao clicar no botão ?");
        if (!journal) {
          logguer.error("Journal não instalado!");
          return;
        }
        (journal as { sheet: { render(show: boolean): void } }).sheet.render(
          true,
        );
      });

      el.appendChild(botao);
      logguer.info("Botão de ajuda de rolagem criado");
    };

    injectButton();
    const target =
      doc.getElementById("chat") ??
      doc.getElementById("sidebar-content") ??
      doc.body;
    const observer = new MutationObserver(() => injectButton());
    observer.observe(target, { childList: true, subtree: true });
  }

  private get gameSettings(): IGameSettings {
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
    return gameContext.settings;
  }

  public async registerSetting(key: string, type: any = String) {
    let commonModuleRef: CommonModule | undefined = undefined;
    const commonModule: CommonModule = (
      injectController.has("CommonModule")
        ? injectController.resolve("CommonModule")
        : commonModuleRef
    ) as CommonModule;
    if (!commonModule) {
      throw new Error(
        "Required dependency 'CommonModule' not registered and no fallback available",
      );
    }
    await commonModule.gameSettings.register(commonModule.name, key, { type });
  }

  public async setSettings(key: string, value: any) {
    let commonModuleRef: CommonModule | undefined = undefined;
    const commonModule: CommonModule = (
      injectController.has("CommonModule")
        ? injectController.resolve("CommonModule")
        : commonModuleRef
    ) as CommonModule;
    if (!commonModule) {
      throw new Error(
        "Required dependency 'CommonModule' not registered and no fallback available",
      );
    }
    await commonModule.gameSettings.set(commonModule.name, key, value);
  }

  public async getSettings(key: string) {
    let commonModuleRef: CommonModule | undefined = undefined;
    const commonModule: CommonModule = (
      injectController.has("CommonModule")
        ? injectController.resolve("CommonModule")
        : commonModuleRef
    ) as CommonModule;
    if (!commonModule) {
      throw new Error(
        "Required dependency 'CommonModule' not registered and no fallback available",
      );
    }
    return await commonModule.gameSettings.get(commonModule.name, key);
  }

  public async updateVersions(
    instalatedVersion: string,
    nextVersionUpdated: string,
  ) {
    let commonModuleRef: CommonModule | undefined = undefined;
    const commonModule: CommonModule = (
      injectController.has("CommonModule")
        ? injectController.resolve("CommonModule")
        : commonModuleRef
    ) as CommonModule;
    if (!commonModule) {
      throw new Error(
        "Required dependency 'CommonModule' not registered and no fallback available",
      );
    }
    if (instalatedVersion !== nextVersionUpdated) {
      commonModule.warnAboutUpdate(instalatedVersion, nextVersionUpdated);

      //code... for old versions

      instalatedVersion = nextVersionUpdated;
      await commonModule.setSettings(
        COMMON_REGISTERED_NAMES.MODULE_VERSION,
        instalatedVersion,
      );
    }
  }

  public async warnAboutUpdate(previousVersion: string, lastVersion: string) {
    let logguerRef: Log | undefined = undefined;
    const logguer: Log = (
      injectController.has("CommonLogguer")
        ? injectController.resolve("CommonLogguer")
        : logguerRef
    ) as Log;
    if (!logguer) {
      throw new Error(
        "Required dependency 'CommonLogguer' not registered and no fallback available",
      );
    }

    logguer.info(
      `Atualizando da versão : ${previousVersion} para a versão ${lastVersion}`,
    );
  }

  public debug(debug: boolean | undefined) {
    if (debug !== undefined) {
      this.#debug = debug;
    }

    return this.#debug;
  }
}
