import { Log, injectController } from "taulukko-commons";
import { Socket, CALLBACK_FUNCTION_EVENT_NAME } from "../common-socket";
import { CommonModule } from "../../common-module";
import { SubModuleBase } from "../../submodules/sub-module-base";


//socketlib Implementation, documentation: https://github.com/farling42/foundryvtt-socketlib#api
export class SocketLib extends SubModuleBase implements Socket {


    private _socketOriginal: any;
    private _requirementModules: number = 2;

    protected initHooks(): void {

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
        const socketLib: SocketLib = injectController.resolve("Socket") as SocketLib;

        const module = game.modules.get(commonModule.name);
        logguer.debug(`Common Socket initializing using socketlib for ${commonModule.name}...`);


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

        Hooks.callAll(CALLBACK_FUNCTION_EVENT_NAME, {});
    }



    public async executeForAll(eventName: string, ...data: any): Promise<any> {
        const logguer: Log = injectController.resolve("CommonLogguer");
        logguer.debug("Socketlib executeForAll for event:", eventName, ',parameters: ', data, '...parameters', ...data);
        return this._socketOriginal.executeForEveryone(eventName, ...data);
    }

    public async executeAsGM(eventName: string, ...data: any): Promise<any> {
        const logguer: Log = injectController.resolve("CommonLogguer");
        logguer.debug("Socketlib executeAsGM start");

        if (!game.user || !game.users || !game.user.isGM) {
            logguer.debug("Socketlib executeAsGM fail validation")
            throw new Error("Isnt ready to send to gm or you arent GM");
        }

        logguer.debug("Socketlib executeAsGM after validation");

        const ret: Promise<any> = this._socketOriginal.executeForEveryone(eventName, ...data);

        logguer.debug("Socketlib executeAsGM end, eventName:", eventName, ",data:", data);

        return ret;
    }

    public async executeToGM(eventName: string, ...data: any): Promise<any> {
        const newData = { data, toGM: true }
        return this._socketOriginal.executeForEveryone(eventName, newData);
    }

    public async executeIn(eventName: string, users: Array<string>, ...data: any): Promise<any> {
        const logguer: Log = injectController.resolve("CommonLogguer");
        logguer.debug("Socketlib executeIn for event:", eventName, ',parameters: ', data, '...parameters', ...data);
        return this._socketOriginal.executeForUsers(eventName, users, ...data);
    }

    public isReadyToSendToGM(): boolean {
        return (game.user as any) || (game.users as any);
    }

    public async register(eventName: string, callback: any): Promise<void> {
        const logguer: Log = injectController.resolve("CommonLogguer");
        logguer.debug("start register,eventName:", eventName);
        this._socketOriginal.register(eventName, async (...data: any) => {
            const logguer: Log = injectController.resolve("CommonLogguer");
            logguer.debug("Socketlib new event:", eventName, ',parameters: ', data, '...parameters', ...data);
            if (Array.isArray(data) && data.length == 1 && data[0].toGM) {
                logguer.debug("Evento pra gm,event:", eventName);
                if (!game.user?.isGM) {
                    logguer.debug("Evento pra gm, descartado pois o usuário não é GM");
                    return;
                }
                return await callback(...data[0].data);
            }
            logguer.debug("Evento não é específico pra gm");
            return await callback(...data);
        });
    }

    public get originalSocket(): any {
        return this._socketOriginal;
    }
};


