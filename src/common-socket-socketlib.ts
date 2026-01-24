import { CommonSocketInterface } from "./common-socket";


let doc : FoundryDocument = document as FoundryDocument;

//socketlib Implementation
export class CommonSocket implements CommonSocketInterface{

    public _socketOriginal:any;
    public _isReady:boolean = false;

    constructor()
    {   
        this.callHooks();
    }

    private callHooks(){

        Hooks.once("socketlib.ready", () => {


            console.log("Socketlib ready");

            const moduleName = doc.COMMON_MODULE.name;
            const module = game.modules.get(moduleName);
            if (!module?.active) {
                console.error(`socketlib | Someone tried to register module '${moduleName}', but no module with that name is active. As a result the registration request has been ignored.`);
                return undefined;
            }

            //enable use of sockets
            module.socket = true;
            
            this._socketOriginal = socketlib.registerModule(moduleName);
            if(this._socketOriginal==undefined)
            {
                throw new Error("socket not loaded");
            }

            this._isReady = true;

            Hooks.callAll("onReadyCommonSocket", { });

        });

    }
    
    public async executeForAll (eventName:string,...data:any):Promise<any>{
        return this._socketOriginal.executeForEveryone(eventName,...data);
    }

     public async executeAsGM (eventName:string,...data:any):Promise<any>{

                    
        if (!game.user ||  !game.users) {
               throw new Error("Game isnt complete prepareted yet, player and gm isnt filled the information. Wait for game ready event ");
        }
        
        return this._socketOriginal.executeAsGM(eventName,...data);
    }
    
    public isReadyToSendToGM ():boolean{
        return game.user || game.users ; 
    }

    public async register(eventName:string,callback:any):Promise<void>
    {
         this._socketOriginal.register(eventName, callback);
    }

    public get originalSocket():any{
        return this._socketOriginal;
    }

    public set originalSocket(socketOriginal:any){
        this._socketOriginal=socketOriginal;
    }

    public isReady(): boolean {
        return this._isReady;
    }
};

export const commonSocket:CommonSocketInterface = new CommonSocket();
