
import { socketFactory } from "./socket-factory";

const commonSocket = socketFactory.getSocket();


let doc : FoundryDocument = document as FoundryDocument;

export function socketTest(){
    Hooks.once("onReadyCommonSocket", async () => {
            doc.COMMON_MODULE.debug("onReadyCommonSocket 20");

            
            //configuration of socket
            commonSocket.register("helloEveryOne", showHelloMessageEveryOne);
    
            commonSocket.register("helloGM", showHelloMessageToGM);
            
            commonSocket.register("helloFromGM", showHelloMessageFromGM);
        


            doc.COMMON_MODULE.debug("Socketlib 20");
            commonSocket.register("add", add);

            commonSocket.register("someusersadd", addWithError);

            doc.COMMON_MODULE.debug("Socketlib finish the register events");


            function showHelloMessageEveryOne(userName:string) {
                doc.COMMON_MODULE.debug(`User ${userName} says hello for everyone!`);
            }

            function showHelloMessageToGM(userName:string) {
                if(!game.user.isGM) return;
                doc.COMMON_MODULE.debug(`User ${userName} says hello to GM!`);
            }

            function showHelloMessageFromGM() {
                if(game.user.isGM) return;
                doc.COMMON_MODULE.debug(`GM say hello to you!`);
            }


            
            function add(a:number, b:number) {
                doc.COMMON_MODULE.debug("The addition is performed on a GM client.");
                return a + b;
            }  
            
            let error:number = 0;
            function addWithError(a:number, b:number) {
                doc.COMMON_MODULE.debug("The addition is performed on a client of manys - addWithErrors.");
                return a + b + error++;
            }  

            try{


            
                if(commonSocket.isReadyToSendToGM())
                { 
                    commonSocket.executeForAll("helloEveryOne", "gand"); 
                    if(game.user.isGM)
                    {
                        commonSocket.executeForAll("helloFromGM"); 
                    }
                    else{
                        commonSocket.executeForAll("helloGM", "gand");
                    }
                    //testar erro, gm nao esta pronto
                    const result = await commonSocket.executeAsGM("add", 5, 6);
                    doc.COMMON_MODULE.log(`The GM client calculated: ${result}`);
                }
                else{
                    doc.COMMON_MODULE.log("A minha implementacao notou que o gm nao foi carregado ainda 1");
                }

                //teste para varios users
                const userids:Array<string> = [];
                game.users.forEach(user=>{
                    userids.push(user.id);
                });
                const result = await commonSocket.executeAsGM("someusersadd", 5, 6);
                doc.COMMON_MODULE.log(`The first user calculated: ${result}`);
            }
            catch(e)
            {
                doc.COMMON_MODULE.log("Socketlib error gm nao carregado",e);
            }

            
        });
        
}