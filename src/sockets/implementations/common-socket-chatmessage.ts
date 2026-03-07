 
import { CacheReturnControl } from "../../cache-returns-control";
import { CommonModule } from "../../common-module";
import { Socket } from "../common-socket";


let doc : FoundryDocument = document as FoundryDocument;

let commonModule:CommonModule;

const CALLBACK_FUNCTION_EVENT_NAME:string = "onReadyCommonSocket";

const CALLBACK_SYSTEM_CALLBACK : "common.socket.chatmessage.callback"="common.socket.chatmessage.callback";

const flagName = 'common-assets';


//socketlib Implementation
export class ChatSocket implements Socket{
 
    private _isReady:boolean = false;
    private _callbacks:Map<string,any> = new Map();
    private _returns:CacheReturnControl<string,any> = new CacheReturnControl();

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

        this.register(CALLBACK_SYSTEM_CALLBACK,(data:any)=>{
            console.debug("CA: ChatSocket adicionando o retorno na pilha de retorno : " , data) ;
            const anotherUserAnswerBefore:boolean = this._returns.has(data.requestId);
            if(anotherUserAnswerBefore)
            {
                console.debug("CA: Já foi respondido antes : " , data) ;
                return;
            }
            this._returns.add(data.requestId,data.response);
                                   
        });
 

        Hooks.callAll(CALLBACK_FUNCTION_EVENT_NAME, {});
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

                const broadcast = payload.users.length==0;

                if(!broadcast)
                {
                    const valid:boolean = payload.users.filter(id=>game.user.id==id).length==1;
                    if(!valid)
                    {
                        commonModule.debug("Ignorado pois não é para este usuário :" , game.user.id , ",payload:",payload,", users:",payload.users, ",usersFiltered:", payload.users.filter(id=>game.user.id==id) );
                        return;  
                    } 
                    
                }
                
                
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
                commonModule.debug('[|Common Socket Chat Message] Chamando callback com dados :', payload); 

                if(callback instanceof Function)
                {
                    commonModule.debug('[|Common Socket Chat Message] callback é uma função como esperado :', callback); 
                }
                else
                {
                    commonModule.debug('[|Common Socket Chat Message] algo deu erroad, callback não é uma função como esperado :', callback); 
                }
                if(payload.type == CALLBACK_SYSTEM_CALLBACK)
                {
                     commonModule.debug('[|Common Socket Chat Message] Retorno do sistema :', payload);  
                     callback( {requestId: payload.data.originalRequestId ,response:payload.data.response});
                     return;
                }
 
                let ret = callback(  ... payload.data);
                commonModule.debug('[Common Socket Chat Message] Retorno do callback :', payload,",ret:",ret); 
                
               
                if(ret==undefined)
                {
                    ret = {common_socket_chat_message_system_empty:true};
                }
                commonModule.log('createChatMessage, devolvendo pra quem pediu o retorno :', ret);  
                this.sendMessage(CALLBACK_SYSTEM_CALLBACK,{response:ret,originalRequestId:payload.requestId},false,false,[payload.senderId]);
                return;

            } catch (e) {
                commonModule.error('[NPC Portrait] Erro ao processar evento:', e);
            }
        });
 
    }

    private  async sendMessage( eventName:string, data:any, onlyPlayers:boolean,toGM:boolean, userids:Array<string>|undefined=undefined){

        const whisper = Array.from(game.users?.values());

        const requestId:string = Math.round( (Math.random()*1000000)).toString();

        const users = (userids==undefined)?[]:userids;

        const payload:PayloadEvent= {
            requestId,
            senderId:game.user.id,
			type: eventName,
            users,
            onlyPlayers,
            toGM,
			data
			};
            
        commonModule.debug('[Common Socket Chat] Enviando mensagem com payload :', payload, ",time:",new Date());

        await ChatMessage.create({
		content: 'Common Socket Event - Ignore this message', // Invisível pra maioria
		whisper,
		flags: {
			'common-assets': payload
		}
		});

        if(eventName==CALLBACK_SYSTEM_CALLBACK)
        {
            commonModule.debug('[Common Socket Chat] Ignorando callback pois é mensagem de sistema :', payload);
            return;
        }

        
        commonModule.debug('[Common Socket Chat] Aguardando retorno do callback :', payload, ",time:",new Date());

        await commonModule.whaitFor(()=>{
            if(this._returns.has(requestId)){
                commonModule.debug('Encontrado o resultado para requestId:' , requestId , " , returns:" , this._returns);
                return true;
            }
            commonModule.debug('Ainda não encontrado o resultado para requestId:' , requestId , " , returns:" , this._returns);
            
            return false;
            
        },60000,1000);

       

        if(!this._returns.has(requestId))
        {
            commonModule.error('[Common Socket Chat] Timeout ao processar evento :', payload,",callbacks:",this._returns,",time:",new Date());
            return;
        }
        const ret = this._returns.get(requestId);

        return ret;
	
    }
    
    public async executeToGM(eventName: string, ...data: any): Promise<any> {
        return this.sendMessage(eventName,data,false,true);
    }

    public async executeForAll (eventName:string,...data:any):Promise<any>{
        return this.sendMessage(eventName,data,false,false);
    }

     public async executeIn(eventName:string,users:Array<string>,...data:any):Promise<any>{
        return this.sendMessage(eventName,data,false,false,users);
     }

     public async executeAsGM (eventName:string,...data:any):Promise<any>{

      if(!this.isReady || !this.isReadyToSendToGM ||  !game.user.isGM)
      {
         throw new Error("Isnt ready to send to gm or you arent GM");
      }
       
       return this.sendMessage(eventName,data,true,false);
    
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
    users:Array<string>
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