import { Socket } from "../common-socket";


let doc : FoundryDocument = document as FoundryDocument;

//socketlib Implementation, documentation: https://github.com/farling42/foundryvtt-socketlib#api
export class SocketLib implements Socket{

    private _socketOriginal:any;
    private _isReady:boolean = false;
    private _requirementModules:number = 2;

    constructor()
    {   
        this.callHooks();
    }

    private init()
    {
        const moduleName = doc.COMMON_MODULE.name;
        const module = game.modules.get(moduleName);
        doc.COMMON_MODULE.debug(`Common Socket initializing using socketlib for ${moduleName}...`) ;

        if (!module?.active) {
            doc.COMMON_MODULE.error(`socketlib | Someone tried to register module '${moduleName}', but no module with that name is active. As a result the registration request has been ignored.`);
            return undefined;
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
        this._socketOriginal = socketlib.registerModule(moduleName);
        if(this._socketOriginal==undefined)
        {
            throw new Error("socket not loaded");
        }

        this._isReady = true;

        Hooks.callAll("onReadyCommonSocket", { });
    }

    private callHooks(){

 
        console.debug("CA: Socketlib waiting for requirements modules...") ;
        
        Hooks.once("onReadyCommonModule", async () => {
            this._requirementModules--;
            if(this._requirementModules<=0)
            {
                doc.COMMON_MODULE.debug("Common Module ready in Common Socket");
                this.init();
            }
            else{
                console.debug("CA: Common Module ready in Common Socket, wait for the socketlib...") ;
            }
        });


    
        Hooks.once("socketlib.ready", () => {

           
            this._requirementModules--;
            if(this._requirementModules<=0)
            {
                doc.COMMON_MODULE.debug("Socketlib ready in Common Socket");

                this.init();
            }
            else{
                console.debug("CA: Socketlib ready in Common Socket, wait for the common module...") ;
            }

        });

        
    }
    
    public async executeForAll (eventName:string,...data:any):Promise<any>{
        doc.COMMON_MODULE.debug("Socketlib executeForAll for event:",eventName, ',parameters: ',data,'...parameters',...data);
        return this._socketOriginal.executeForEveryone(eventName,...data);
    }

     public async executeAsGM (eventName:string,...data:any):Promise<any>{

                    
        if (!game.user ||  !game.users) {
               throw new Error("Game isnt complete prepareted yet, player and gm isnt filled the information. Wait for game ready event ");
        }
        
        return this._socketOriginal.executeAsGM(eventName,...data);
    }

    public async executeToGM(eventName: string, ...data: any): Promise<any> {
        const newData = {data,toGM:true} 
        return this._socketOriginal.executeForEveryone(eventName,newData);
    }

    public async executeIn(eventName:string,users:Array<string>,...data:any):Promise<any>{
          doc.COMMON_MODULE.debug("Socketlib executeIn for event:",eventName, ',parameters: ',data,'...parameters',...data);
        return this._socketOriginal.executeForUsers(eventName,users,...data);
    }

    public isReadyToSendToGM ():boolean{
        return (game.user as any) || (game.users as any) ; 
    }

    public async register(eventName:string,callback:any):Promise<void>
    {
         this._socketOriginal.register(eventName,async ( ...data: any)=>{
             doc.COMMON_MODULE.debug("Socketlib new event:",eventName, ',parameters: ',data,'...parameters',...data);
            if(data instanceof Array && data.length == 1 && data[0].toGM)
            {
                doc.COMMON_MODULE.debug("Evento pra gm");
                if(!game.user || !game.user.isGM)
                {
                    doc.COMMON_MODULE.debug("Evento pra gm, descartado pois o usuário não é GM");
                    return;
                }
                 return await callback( ...data[0].data);
            } 
            doc.COMMON_MODULE.debug("Evento não é específico pra gm");
            return await callback( ...data);
         });
    }

    public get originalSocket():any{
        return this._socketOriginal;
    }
 
    public isReady(): boolean {
        return this._isReady;
    }
};


export const socketLibImplementation:Socket = new SocketLib();
