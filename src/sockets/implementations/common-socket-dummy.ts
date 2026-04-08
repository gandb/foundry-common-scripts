import { Log, injectController } from "taulukko-commons";
import { SubModuleBase } from "../../submodules/sub-module-base";
import { Socket } from "../common-socket";


//socketlib Implementation, documentation: https://github.com/farling42/foundryvtt-socketlib#api
const doc: FoundryDocument = document as FoundryDocument;

export class DummySocket extends SubModuleBase implements Socket {

    protected initHooks(): void {
        Hooks.once("onReadyCommonModule", async () => {
            this.init();
        });
    }
    protected async waitReady() {
        Hooks.callAll("onReadyCommonSocket", {});
    }



    public async executeForAll(eventName: string, ...data: any): Promise<any> {
        const logguer: Log = injectController.resolve("CommonLogguer");
        logguer.debug("Socket dummy executeForAll for event:", eventName, ',parameters: ', data, '...parameters', ...data);
        return undefined;
    }

    public async executeAsGM(eventName: string, ...data: any): Promise<any> {
        const logguer: Log = injectController.resolve("CommonLogguer");
        if (!game.user || !game.users) {
            throw new Error("Game isnt complete prepareted yet, player and gm isnt filled the information. Wait for game ready event ");
        }
        logguer.debug("Socket dummy executeAsGM for event:", eventName, ',parameters: ', data, '...parameters', ...data);
        return undefined;
    }

    public async executeToGM(eventName: string, ...data: any): Promise<any> {
        const logguer: Log = injectController.resolve("CommonLogguer");
        logguer.debug("Socket dummy executeAsGM for event:", eventName, ',parameters: ', data, '...parameters', ...data);
        return undefined;
    }

    public async executeIn(eventName: string, users: Array<string>, ...data: any): Promise<any> {
        return undefined;
    }

    public isReadyToSendToGM(): boolean {
        return false;
    }

    public async register(eventName: string, callback: any): Promise<void> {
        return;
    }
};

