export { Button } from "./button";
export { NPC } from "./npc";
export { NPCDialog } from "./npc-dialog";
export { NPCPortraitDialog } from "./npc-portrait-dialog";
 
var __npc_dialog_first_time = false;

 
(async  () => {
    if(__npc_dialog_first_time)
    {
        return;
    }
    __npc_dialog_first_time = true;
    
    console.log("DBG-chat: iniciando...");
    var chat;
    var handle:NodeJS.Timeout;
    const MESSAGE_CLASS = "chat-message";
    const SELECTOR_CHAT:string = ".active-chat";
    const SLEEP_TIME:number = 1000; //1 seg
    const CLASS_HIDDEN:string ="socket-chat-event";
    const TIME_OUT:number = 60000; //1 min

  
    const waitFor = async (tester:() => Promise<boolean>) =>
    {
      
        let spendTime :number =0;

        //neste arquivo ele nao tem o loguer pois ele roda antes do carregamento do loguer
        //console.log("DBG-chat: waiting for acionado");
        const ret: Promise<boolean> = new Promise<boolean>((executer,reject)=>
        { 
            handle = setInterval( async () => {
                //console.log("DBG-chat: waiting testing");
                if(!await tester() && spendTime < TIME_OUT )
                {
                    spendTime += SLEEP_TIME;
                    //console.log("DBG-chat: aguardando interval...",spendTime);
                    return;
                }

                if(spendTime>= TIME_OUT)
                {
                    reject(false);
                     //console.log("DBG-chat: tester rejected",spendTime);
                    return;
                }

                //console.log("DBG-chat: testing return true");
                clearInterval(handle);
                executer(true);
            },SLEEP_TIME);
        });
        return ret;
    };

    
    const chatLoaded = await waitFor(async () : Promise<boolean> => {
        //console.log("DBG-chat: test chat loaded...");
        return document.querySelectorAll(SELECTOR_CHAT).length>0;
     
    }) ;

    //console.log("DBG-chat: chat encontrado...",document.querySelectorAll(SELECTOR_CHAT));

    if(!chatLoaded)
    {
        //console.log("DBG-chat: timeout waiting for chat...");
        return;
    }
 
    const setupObserver = (targetNode: Node): void => {
                    //console.log("DBG-chat: observando mudancas...","|" + targetNode +"|");
        const observer = new MutationObserver((mutations) => {
            //console.log("DBG-chat: mudanças encontradas...");
            mutations.forEach((mutation) => {
                if(!mutation || mutation.toString()=="" || mutation.addedNodes.item(0)==null)
                {
                  //console.log("DBG-chat: mudanca vazia encontrada e ignorada...");  
                  return;
                }

                  //console.log("DBG-chat: analisando mudanças...","|" + mutation +"|");

                    mutation.addedNodes.forEach((node) => {
                        
                        if (!(node instanceof HTMLElement )) {
                            return;
                        }
                        //console.log("DBG-chat: node adicionado...",node); 

                        if(!node.classList.contains(MESSAGE_CLASS))
                        {
                            //console.log("DBG-chat:  não é uma mensagen ",node); 
                            return; 
                        }
                        if(node.innerHTML.toString().indexOf("NPC Portrait Event") < 0 )
                        {
                            //console.log("DBG-chat: mensagem não é um evento",node); 
                            return; 
                        }
                        
                        //console.log("DBG-chat: mensagem encontrada",node); 
                        node.remove();
 
                    });
                });
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    };

    setupObserver(document.querySelector(SELECTOR_CHAT) as HTMLElement);
 
})();


 
 