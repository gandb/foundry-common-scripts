import { Log, injectController } from "taulukko-commons";
import { SubModuleBase } from "../sub-module-base";
import { CommonModule } from "../../common-module";

let playersTools: PlayersTools | undefined = undefined;

export class PlayersTools extends SubModuleBase {
  constructor() {
    super();
    playersTools = this;
  }
  #requiredHooksLoaded: boolean = false;

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

    const fiveMinute: number = 5 * 60 * 1000;
    playersTools = (
      injectController.has("PlayersTools")
        ? injectController.resolve("PlayersTools")
        : playersTools
    ) as PlayersTools;

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
    logguer.debug("Starting PlayersTools init hooks");
    playersTools.initializeFlyMeasure();
    playersTools.#requiredHooksLoaded = true;
  }

  protected async waitReady() {
    const fiveMinutes = 5 * 60 * 1000;
    await this.whaitFor(() => this.#requiredHooksLoaded, fiveMinutes);
    if (!this.#requiredHooksLoaded) {
      throw new Error("Timeout waiting for hooks");
    }
    Hooks.callAll("onReadyPlayersTools", {});
  }

  public initializeFlyMeasure() {
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
    logguer.debug("initlizeFlyMeasure init");
  }
}
