export { Button } from "./button";
export { NPC } from "./npc";
export { NPCDialog } from "./npc-dialog";
export { NPCPortraitDialog } from "./npc-portrait-dialog";


import { Log, LogGenericImpl, injectController } from "taulukko-commons";


/*
(() => {
    var logguer;
    var chat;

    const setupObserver = (targetNode: Node, selector: string): void => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {

            mutation.addedNodes.forEach((node) => {
                if (!(node instanceof HTMLElement ) || !node.matches(selector)) {
                    return;
                }
                const messages:NodeList = node.querySelectorAll(".chat-message.message");

                messages.forEach((messageNode=>{

                    const message = messageNode as HTMLElement
                    if((message as HTMLElement).innerHTML.indexOf("NPC Portrait Event") <0 )
                    {
                        return;
                    }
                    
                    if(message.classList.contains("socket-chat-event"))
                    {
                        return; 
                    }
                    message.classList.add("socket-chat-event");
                }));
                            
            });
            });
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    };

   


    window.addEventListener('DOMContentLoaded', (event) => {
         const chatSidebarSelector:string = '.chat-sidebar';
        const chat:HTMLElement =  document.querySelector(chatSidebarSelector) as HTMLElement;


        if (!chat || !(chat instanceof HTMLElement)) {
            console.log(`Element chat not found.`);
        }

        if(!injectController.has("CommonLogguer"))
        {
            injectController.registerByName("CommonLogguer", new LogGenericImpl( ));
        }

        const logguer: Log = injectController.resolve("CommonLogguer");
        
        if(!logguer)
        {
            console.error("NPC Submodule : Logguer not loaded");
            return;
        }
 

        setupObserver(chat , '.chat-sidebar');
 
    });
})();


 

*/
