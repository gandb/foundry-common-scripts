import { Log, injectController } from "taulukko-commons";

export abstract class ModuleBase {

    #ready: boolean = false;

    public isReady(): boolean {
        return this.#ready;
    }

    public async init() {
        this.initHooks();
        await this.waitReady();
        this.#ready = true;
    }


    protected abstract initHooks(): void;
    protected abstract waitReady(): Promise<void>;


    public async whaitFor(test: () => boolean, timeout: number = 60000, sleep: number = 100): Promise<void> {
        const logguer: Log = injectController.resolve("Log");

        let totalTime = 0;
        const ret: Promise<void> = new Promise<void>((resolve, reject) => {
            const handle = setInterval(() => {


                if (test()) {
                    clearInterval(handle);
                    resolve();
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


}