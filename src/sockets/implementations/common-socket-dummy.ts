import { Socket } from "../common-socket";

 
//socketlib Implementation, documentation: https://github.com/farling42/foundryvtt-socketlib#api
const doc:FoundryDocument = document as FoundryDocument;

export class DummySocket implements Socket{

    _isReady:boolean=false;
 
    constructor()
    {   
        this.callHooks();
    }

    private init()
    { 
        doc.COMMON_MODULE.debug(`Dummy Socket initializing...`) ;         
        this._isReady = true;
        Hooks.callAll("onReadyCommonSocket", { });
    }

    private callHooks(){     
        Hooks.once("onReadyCommonModule", async () => {
            this.init();            
        }); 
    }
    
    public async executeForAll (eventName:string,...data:any):Promise<any>{
        doc.COMMON_MODULE.debug("Socket dummy executeForAll for event:",eventName, ',parameters: ',data,'...parameters',...data);
        return undefined;
    }

     public async executeAsGM (eventName:string,...data:any):Promise<any>{
                    
        if (!game.user ||  !game.users) {
               throw new Error("Game isnt complete prepareted yet, player and gm isnt filled the information. Wait for game ready event ");
        }
        doc.COMMON_MODULE.debug("Socket dummy executeAsGM for event:",eventName, ',parameters: ',data,'...parameters',...data);
        return undefined;
    }

    public async executeToGM(eventName: string, ...data: any): Promise<any> {
        doc.COMMON_MODULE.debug("Socket dummy executeAsGM for event:",eventName, ',parameters: ',data,'...parameters',...data);
        return undefined;
    }

    public async executeIn(eventName:string,users:Array<string>,...data:any):Promise<any>{
        return undefined;
    }

    public isReadyToSendToGM ():boolean{
        return false;
    }

    public async register(eventName:string,callback:any):Promise<void>
    {
        return;
    }

    public isReady(): boolean {
        return this._isReady;
    }
};


export const dummySocketImplementation:Socket = new DummySocket();
