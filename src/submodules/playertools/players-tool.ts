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
    const commonModule: CommonModule = injectController.resolve("CommonModule");

    const fiveMinute: number = 5 * 60 * 1000;
    playersTools = (
      injectController.has("PlayersTools")
        ? injectController.resolve("PlayersTools")
        : playersTools
    ) as PlayersTools;

    const logguer: Log = injectController.resolve("CommonLogguer");
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
    const logguer: Log = injectController.resolve("CommonLogguer");
    logguer.debug("initlizeFlyMeasure init");
  }
}
