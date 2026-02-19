 
import { CommonModule } from "./common-module";
import { Socket } from "./common-socket";


let doc : FoundryDocument = document as FoundryDocument;

let commonModule:CommonModule;

const CALLBACK_FUNCTION_EVENT_NAME:string = "onReadyCommonSocket";

const flagName = 'common-assets';

//socketlib Implementation
export class ChatSocket implements Socket{
 
    private _isReady:boolean = false;
    private _callbacks:Map<string,any> = new Map();
    private _returns:Map<string,any> = new Map();

    constructor()
    {   
        this.callHooks();
    }


    private init()
    {
        const moduleName = doc.COMMON_MODULE.name;
        const module = game.modules.get(moduleName);
        doc.COMMON_MODULE.debug(`Common Socket initializing for ${moduleName}...`) ;

        if (!module?.active) {
            doc.COMMON_MODULE.error(`Chat Socket | Someone tried to register module '${moduleName}', but no module with that name is active. As a result the registration request has been ignored.`);
            return undefined;
        }
 
         

        this._isReady = true;

        this._callbacks.set("common.socket.chatmessage.callback",(data:any)=>{
            this._returns.set(data.requestId,data);
        });

        Hooks.callAll("onReadyCommonSocket", { });
    }

    private callHooks(){

 
        console.debug("CA: ChatSocket waiting for requirements modules...") ;
        
        Hooks.once("onReadyCommonModule", async () => {
        
            commonModule =doc.COMMON_MODULE;
            commonModule.debug("Common Module ready in Chat Socket");
            this.init();
        
        });


        Hooks.on('createChatMessage', (message: any) => {
            try {
                commonModule.debug("createChatMessage recebido...") ;  
                // Verifica se é um evento nosso
                const eventReceived:string = message.flags?.[flagName]?.type;

                if (!eventReceived){
                    return;                          
                }
                const payload:PayloadEvent=message.flags[flagName] as  PayloadEvent; 
                
                commonModule.debug('[|Common Socket Chat Message] Evento recebido:', payload); 
                if(game.user.isGM &&  payload.onlyPlayers)
                {
                    commonModule.debug('[|Common Socket Chat Message] Evento recebido para players e o receptor é GM, evento descartado :', payload); 
                    return;
                
                }
                else if (!game.user.isGM &&  payload.toGM)
                {
                    commonModule.debug('[|Common Socket Chat Message] Evento recebido é pro GM e o receptor não é GM, evento descartado :', payload); 
                    return;
                }
                
                const callback =  this._callbacks.get(payload.type);
                if(!callback)
                {
                    commonModule.debug('[|Common Socket Chat Message] Evento recebido não registrado :', payload.type , " para o payload : " ,payload); 
                    return;
                }
                const ret = callback(... payload.data);
                commonModule.log('createChatMessage:', ret);
                this.register(CALLBACK_FUNCTION_EVENT_NAME,(data:any)=>{
                    this._returns.set(data.originalRequestId,data.response);
                });
                this.sendMessage(CALLBACK_FUNCTION_EVENT_NAME,{response:ret,originalRequestId:payload.requestId},false,false,false,[payload.senderId]);
                return;

            } catch (e) {
                commonModule.error('[NPC Portrait] Erro ao processar evento:', e);
            }
        });
 
    }

    private  async sendMessage( eventName:string, data:any, broadcast:boolean,onlyPlayers:boolean,toGM:boolean, userids:Array<string>|undefined=undefined){

        const whisper = (broadcast)? Array.from(game.users?.values() || []).map((u: any) => u.id):userids;

        const requestId:string = (Math.random()*1000000).toString();

        const payload:PayloadEvent= {
            requestId,
            senderId:game.user.id,
			type: eventName,
            onlyPlayers,
            toGM,
			data
			};

        await ChatMessage.create({
		content: 'Common Socket Event - Ignore this message', // Invisível pra maioria
		whisper,
		flags: {
			'common-assets': payload
		}
		});

        commonModule.whaitFor(()=>this._callbacks.has(requestId),60000);
        
        if(!this._callbacks.has(requestId))
        {
            commonModule.error('[Common Socket Chat] Timeout ao processar evento :', payload);
        }
        const ret = this._callbacks.get(requestId);

        this._callbacks.delete(requestId);

        return ret;
	
    }
    
    public async executeToGM(eventName: string, ...data: any): Promise<any> {
        return this.sendMessage(eventName,data,true,false,true);
    }

    public async executeForAll (eventName:string,...data:any):Promise<any>{
        return this.sendMessage(eventName,data,true,false,false);
    }

     public async executeAsGM (eventName:string,...data:any):Promise<any>{

       if(!this.isReadyToSendToGM)
       {
            throw new Error("Isnt ready to send to gm");
       }

       if(!game.user.isGM)
       {
             throw new Error("You arent GM");
       }

       
       this.sendMessage(eventName,data,true,false,false);
    
    }
    
    public isReadyToSendToGM ():boolean{
        return (game.user as any) || (game.users as any) ; 
    }

    public async register(eventName:string,callback:any):Promise<void>
    {
        this._callbacks.set(eventName,callback);
    }

    public get originalSocket():any{
         return this;
    }
 
    public isReady(): boolean {
        return this._isReady;
    }
};

interface PayloadEvent{
    requestId:string;
    senderId:string;
	type:string;
    onlyPlayers:boolean;
    toGM:boolean;
	data:any;
}

export const chatSocketImplementation:Socket = new ChatSocket();


/*


       if(Array.from(this._callbacks.keys()).filter(key=>key==eventName).length == 0)
       {
         throw new Error("Event not registered yet");
       }
*/