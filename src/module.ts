
import { injectController  , Level, LogGenericImpl } from "taulukko-commons";
import { CommonModule } from "./common-module";
import { NPC, NPCDialog, DialogUtils, ModuleBase, SubModuleBase } from "./";
 

const commonModule = new CommonModule();
const win = (window as any) as  FoundryWindow;
const loaded = false;

const proccessModuleId:number = Math.round(Math.random()*1000000);

win.TaulukkoCommon = {
    NPC,
    NPCDialog,
    DialogUtils,
    ModuleBase,
    SubModuleBase,
    LogGenericImpl,
    injectController, 
    Level, 
    moduleProccessId:0
};

async function initModule() {
    const win = (window as any) as  FoundryWindow;

    const anotherInstanceWin = win.TaulukkoCommon.moduleProccessId != proccessModuleId;

    if(anotherInstanceWin)
    {
        return;
    }
     
    const configResponse = await fetch('/modules/common-scripts-dnd5ed/scripts/config.json');
    const config = await configResponse.json();
    const logConfig = config.log || { format: "", prefix: "CA", hasDate: true, hasLevel: true };
    const levelValue = config.log?.level ?? "DEBUG";
    
    const logguer: LogGenericImpl = new LogGenericImpl(logConfig);

    const level = Level[levelValue as keyof typeof Level] ?? Level.DEBUG;
    logguer.level(level);

    injectController.registerByName("FoundryDocument", document);
    injectController.registerByName("CommonModule", commonModule);
    injectController.registerByName("CommonLogguer", logguer);

    commonModule.init();
}

win.TaulukkoCommon.moduleProccessId = proccessModuleId;

const sleep:number =win.TaulukkoCommon.moduleProccessId %1000;

window.setTimeout(initModule,sleep);
