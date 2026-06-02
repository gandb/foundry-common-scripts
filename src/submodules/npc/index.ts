export { Button } from "./button";
export { NPC } from "./npc";
export { NPCDialog } from "./npc-dialog";
export { NPCPortraitDialog } from "./npc-portrait-dialog";


import { Log, LogGenericImpl, injectController } from "taulukko-commons";

 
(async  () => {
    var logguer;
    var chat;
    var handle:NodeJS.Timeout;
    const SELECTOR_CHAT:string = ".active-chat";
    const SELECTOR_MESSAGES = "chat-message.message";
    const SLEEP_TIME:number = 1000; //1 seg
    const CLASS_HIDDEN:string ="socket-chat-event";
    const TIME_OUT:number = 60000; //1 min

    /*if(!injectController.has("CommonLogguer"))
    {
        injectController.registerByName("CommonLogguer", new LogGenericImpl( ));
    }

    const logguer: Log = injectController.resolve("CommonLogguer");
    
    if(!logguer)
      */

    const waitFor = async (tester:() => Promise<boolean>) =>
    {
      
        let spendTime :number =0;

        console.log("DBG-chat: waiting for acionado");
        const ret: Promise<boolean> = new Promise<boolean>((executer,reject)=>
        { 
            handle = setInterval( async () => {
                console.log("DBG-chat: waiting testing");
                if(!await tester() && spendTime < TIME_OUT )
                {
                    spendTime += SLEEP_TIME;
                    console.log("DBG-chat: aguardando interval...",spendTime);
                    return;
                }

                if(spendTime>= TIME_OUT)
                {
                    reject(false);
                     console.log("DBG-chat: tester rejected",spendTime);
                    return;
                }

                console.log("DBG-chat: testing return true");
                clearInterval(handle);
                executer(true);
            },SLEEP_TIME);
        });
        return ret;
    };

    
    const chatLoaded = await waitFor(async () : Promise<boolean> => {
        console.log("DBG-chat: test chat loaded...");
        return document.querySelectorAll(SELECTOR_CHAT).length>0;
     
    }) ;

    console.log("DBG-chat: chat encontrado...",document.querySelectorAll(SELECTOR_CHAT));

    if(!chatLoaded)
    {
        console.log("DBG-chat: timeout waiting for chat...");
        return;
    }
 
    const setupObserver = (targetNode: Node): void => {
                    console.log("DBG-chat: observando mudancas...","|" + targetNode +"|");
        const observer = new MutationObserver((mutations) => {
            console.log("DBG-chat: observando mudancas...");
            mutations.forEach((mutation) => {
                if(!mutation || mutation.toString()=="" || mutation.addedNodes.item(0)==null)
                {
                  console.log("DBG-chat: mudanca vazia encontrada e ignorada...");  
                  return;
                }

                  console.log("DBG-chat: mudanca encontrada...","|" + mutation +"|");

                    mutation.addedNodes.forEach((node) => {
                        if (!(node instanceof HTMLElement )) {
                            return;
                        }
                        console.log("DBG-chat: node adicionado...",node); 

                        if(!node.classList.contains(SELECTOR_MESSAGES) || node.classList.contains(CLASS_HIDDEN))
                        {
                            return; 
                        }
                         
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
 
});//();


 
 