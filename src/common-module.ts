import { Log, injectController } from "taulukko-commons";
import { ModuleBase } from "./common/module-base";
import type { IGameContext, IGameSettings } from "./common/igame-context";
import type { IFoundryAPI } from "./common/ifoundry-api"; // Caminho corrigido
import { SubModuleBase } from "./submodules/sub-module-base";
import { RegionUtils } from "./submodules/region-utils/region-utils";
import { PlayersTools } from "./submodules/playertools/players-tool";
import { DialogUtils } from "./submodules/dialog-utils/dialog-utils";
import { HeroPoints } from "./submodules/hero-points/hero-points";
import { HideUnidentify } from "./submodules/hide-unindentify/hide-unidentify";
import { DummySocket } from "./sockets/implementations/common-socket-dummy";
import { Socket } from "./sockets/common-socket";
import { NPCDialog } from "./submodules";
import { FlightMovement } from "./submodules/flight-movement/flight-movement";

const COMMON_REGISTERED_NAMES = {
  MODULE_VERSION: "common-assets-version",
};

const doc: FoundryDocument = document as FoundryDocument;
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
    const logguer: Log = injectController.resolve("CommonLogguer");
    const commonModule: CommonModule = injectController.resolve("CommonModule");

    logguer.debug(
      "addInitCommonAssetsChanges:20,register  commnModule:",
      commonModule,
    );

    commonModule.registerSetting(COMMON_REGISTERED_NAMES.MODULE_VERSION);
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
      new HeroPoints(),
      new HideUnidentify(),
      new FlightMovement(),
    );

    subModules.forEach(async (subModule) => {
      injectController.registerByClass(subModule);
      subModule.init().then(() => {
        const logguer: Log = injectController.resolve("CommonLogguer");
        logguer.debug("Submodule loaded : ", subModule);
      });
    });

    //choose implementation dependes what I want
    const commonSocket: Socket = new DummySocket();
    injectController.registerByName("Socket", commonSocket);
  }

  protected async waitReady() {
    const logguer: Log = injectController.resolve("CommonLogguer");
    const commonModule: CommonModule = injectController.resolve("CommonModule");
    const foundry: IFoundryAPI = injectController.resolve("FoundryAPI");

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
    const commonModule: CommonModule = injectController.resolve("CommonModule");
    const foundry: IFoundryAPI = injectController.resolve("FoundryAPI");
    commonModule.loadSubModules().then(() => {
      const logguer: Log = injectController.resolve("CommonLogguer");
      logguer.info("All submodules from common modules loaded with success");
    });

    foundry.hooks.once("init", async () => {
      const commonModule: CommonModule =
        injectController.resolve("CommonModule");
      const logguer: Log = injectController.resolve("CommonLogguer");

      logguer.info("Módulo Common Assets inicalizando 2...", commonModule);
      await commonModule.addInitCommonAssetsChanges();
    });

    foundry.hooks.once("ready", async () => {
      const commonModule: CommonModule =
        injectController.resolve("CommonModule");
      const logguer: Log = injectController.resolve("CommonLogguer");

      if (!commonModule.version) {
        logguer.error(
          "Módulo Common Assets não está instalado ou não foi iniciado corretamente.",
        );
        return;
      }

      const gameContext: IGameContext = injectController.resolve(
        "GameContext",
      ) as IGameContext;
      if (gameContext.user?.isGM) {
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
      //socketTest();

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
    const logguer: Log = injectController.resolve("CommonLogguer");

    logguer.info("Criando botão de ajuda de rolagem");
    const el = doc.getElementById("roll-privacy");

    if (!el) {
      logguer.error("Menu privacy não encontrado");
      return;
    }

    const botao = doc.createElement("button");
    botao.textContent = "?";
    botao.className = "ui-control icon fa-solid fa-help common-assets-help";
    botao.addEventListener("click", (event) => {
      event.preventDefault();
      const gameContext: IGameContext = injectController.resolve(
        "GameContext",
      ) as IGameContext;
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
  }

  private get gameSettings(): IGameSettings {
    const gameContext: IGameContext = injectController.resolve(
      "GameContext",
    ) as IGameContext;
    return gameContext.settings;
  }

  public async registerSetting(key: string, type: any = String) {
    const commonModule: CommonModule = injectController.resolve("CommonModule");
    await commonModule.gameSettings.register(commonModule.name, key, { type });
  }

  public async setSettings(key: string, value: any) {
    const commonModule: CommonModule = injectController.resolve("CommonModule");
    await commonModule.gameSettings.set(commonModule.name, key, value);
  }

  public async getSettings(key: string) {
    const commonModule: CommonModule = injectController.resolve("CommonModule");
    return await commonModule.gameSettings.get(commonModule.name, key);
  }

  public async updateVersions(
    instalatedVersion: string,
    nextVersionUpdated: string,
  ) {
    const commonModule: CommonModule = injectController.resolve("CommonModule");
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
    const logguer: Log = injectController.resolve("CommonLogguer");

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
