import { Log, injectController } from "taulukko-commons";
import {
  Socket,
  CALLBACK_FUNCTION_EVENT_NAME,
  RETURN_CONTROL_NAME,
} from "../common-socket";
import { CommonModule } from "../../common-module";
import { SubModuleBase } from "../../submodules/sub-module-base";
import { CacheReturnControl } from "../../common/cache-returns-control";
import type { IGameContext } from "../../common/igame-context";

//socketlib Implementation, documentation: https://github.com/farling42/foundryvtt-socketlib#api
export class SocketLib extends SubModuleBase implements Socket {
  private _socketOriginal: any;
  private _requirementModules: number = 2;

  private get gameContext(): IGameContext {
    return injectController.resolve("GameContext") as IGameContext;
  }

  private get socketOriginal(): any {
    return this._socketOriginal;
  }

  private getNonGMUserIds(): string[] {
    if (!this.gameContext.users) return [];
    const users = Array.from(this.gameContext.users.values()) as Array<{
      isGM: boolean;
      id: string;
    }>;
    return users.filter((user) => !user.isGM).map((user) => user.id);
  }

  protected async initHooks() {
    const logguer: Log = injectController.resolve("CommonLogguer");

    logguer.debug("CA: Socketlib waiting for requirements modules...");

    Hooks.once("onReadyCommonModule", async () => {
      this._requirementModules--;
    });

    Hooks.once("socketlib.ready", () => {
      this._requirementModules--;
    });
  }
  protected async waitReady() {
    const logguer: Log = injectController.resolve("CommonLogguer");
    const commonModule: CommonModule = injectController.resolve("CommonModule");
    const socketLib: SocketLib = injectController.resolve(
      "Socket",
    ) as SocketLib;

    const module = this.gameContext.modules.get(commonModule.name);
    logguer.debug(
      `Common Socket initializing using socketlib for ${commonModule.name}...`,
    );

    if (!module?.active) {
      const message: string = `socketlib | Someone tried to register module '${commonModule.name}', but no module with that name is active. As a result the registration request has been ignored.`;
      logguer.error(message);
      throw new Error(message);
    }

    const fiveMinutes = 5 * 60 * 1000;

    await this.whaitFor(() => socketLib._requirementModules <= 0, fiveMinutes);
    if (socketLib._requirementModules > 0) {
      throw new Error("Timeout waiting for socketlib requirements");
    }

    /*note: only work sockets if in manifest socket:true, eg:
        ..., 
            "compatibility": {
                "minimum": "13",
                "verified": "13"
            },
            "socket":true, <= need this to work with socketlib
            "packs": [
                {
                "label": "Common Assets",
                "type": "Adventure",
                "name": "common-assets",
        ...
        */
    this._socketOriginal = socketlib.registerModule(commonModule.name);
    if (this._socketOriginal == undefined) {
      throw new Error("socket not loaded");
    }

    // Armazena a instância original para uso local
    const returnsControl = new CacheReturnControl<string, any>();
    injectController.registerByName(RETURN_CONTROL_NAME, returnsControl);

    Hooks.callAll(CALLBACK_FUNCTION_EVENT_NAME, {});
  }

  public async executeForAll(eventName: string, ...data: any): Promise<any> {
    const logguer: Log = injectController.resolve("CommonLogguer");
    const socketLib: SocketLib = injectController.resolve("Socket");
    logguer.debug(
      "Socketlib executeForAll for event:",
      eventName,
      ",parameters: ",
      data,
      "...parameters",
      ...data,
    );
    return socketLib.socketOriginal.executeForEveryone(eventName, ...data);
  }

  public async executeAsGM(eventName: string, ...data: any): Promise<any> {
    const logguer: Log = injectController.resolve("CommonLogguer");
    const socketLib: SocketLib = injectController.resolve("Socket");
    logguer.debug("Socketlib executeAsGM start");

    if (
      !socketLib.gameContext.user ||
      !socketLib.gameContext.users ||
      !socketLib.gameContext.user.isGM
    ) {
      logguer.debug("Socketlib executeAsGM fail validation");
      throw new Error("Isnt ready to send to gm or you isnt GM");
    }

    logguer.debug("Socketlib executeAsGM after validation");

    const nonGMUserIds = socketLib.getNonGMUserIds();
    if (nonGMUserIds.length === 0) {
      logguer.debug("Socketlib executeAsGM: no non-GM users found, skipping");
      return Promise.resolve();
    }

    const payload = { data, onlyPlayers: true };
    const ret: Promise<any> = socketLib.socketOriginal.executeForUsers(
      eventName,
      nonGMUserIds,
      payload,
    );

    logguer.debug(
      "Socketlib executeAsGM end, eventName:",
      eventName,
      ",data:",
      data,
    );

    return ret;
  }

  public async executeToGM(eventName: string, ...data: any): Promise<any> {
    const socketLib: SocketLib = injectController.resolve("Socket");
    const newData = { data, toGM: true };
    return socketLib.socketOriginal.executeForEveryone(eventName, newData);
  }

  public async executeIn(
    eventName: string,
    users: Array<string>,
    ...data: any
  ): Promise<any> {
    const logguer: Log = injectController.resolve("CommonLogguer");
    const socketLib: SocketLib = injectController.resolve("Socket");
    logguer.debug(
      "Socketlib executeIn for event:",
      eventName,
      ",parameters: ",
      data,
      "...parameters",
      ...data,
    );
    return socketLib.socketOriginal.executeForUsers(eventName, users, ...data);
  }

  public isReadyToSendToGM(): boolean {
    return this.gameContext.user?.isGM === true;
  }

  public async register(eventName: string, callback: any): Promise<void> {
    const logguer: Log = injectController.resolve("CommonLogguer");
    const socketLib: SocketLib = injectController.resolve("Socket");
    logguer.debug("start register,eventName:", eventName);
    socketLib._socketOriginal.register(eventName, async (...data: any) => {
      const logguer: Log = injectController.resolve("CommonLogguer");
      logguer.debug(
        "Socketlib new event:",
        eventName,
        ",parameters: ",
        data,
        "...parameters",
        ...data,
      );
      if (Array.isArray(data) && data.length == 1) {
        if (data[0].toGM) {
          logguer.debug("Evento pra gm,event:", eventName);
          if (!socketLib.gameContext.user?.isGM) {
            logguer.debug("Evento pra gm, descartado pois o usuário não é GM");
            return;
          }
          return await callback(...data[0].data);
        }
      }
      logguer.debug("Evento não é específico pra gm nem apenas para players");
      return await callback(...data);
    });
  }
}
