
import { socketFactory } from "./socket-factory";

const commonSocket = socketFactory.getSocket();


let doc : FoundryDocument = document as FoundryDocument;

export function socketTest(){
    Hooks.once("onReadyCommonSocket", async () => {
            doc.COMMON_MODULE.debug("onReadyCommonSocket 20");

            
            //configuration of socket
            commonSocket.register("helloEveryOne", showHelloMessageEveryOne);
    
            commonSocket.register("heldebugM", showHelloMessageToGM);
            
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
                    doc.COMMON_MODULE.debug("Gm esta pronto pra receber mensagens");
                    commonSocket.executeForAll("helloEveryOne", "teste1"); 
                    doc.COMMON_MODULE.debug("Depois de usar executeForAll");

                    

                    if(game.user.isGM)
                    {
                        
                        let result = await commonSocket.executeAsGM("add", 5, 6);
                        doc.COMMON_MODULE.debug(`The player calculated: ${result}`);
                        await commonSocket.executeAsGM("helloFromGM","Hello from ","GM"); //esta mensagem jamais deveria aparecer no GM
                        doc.COMMON_MODULE.debug("depois de helloFromGM 1");
                    }
                    else{
                        commonSocket.executeForAll("helloEveryOne", "teste2");
                       doc.COMMON_MODULE.debug("Depois de heldebugM");
                    }
         
                }
                else{
                    doc.COMMON_MODULE.debug("A minha implementacao notou que o gm nao foi carregado ainda 1");
                }
                commonSocket.executeForAll("helloEveryOne","teste3"); 
                doc.COMMON_MODULE.debug("depois de helloEveryOne 2");

               commonSocket.executeToGM("helloEveryOne", "esse-apenas-gm-deveria-receber");
 
                let userids:string[] = game.users.map(u=>u.id);
                
                userids = userids.filter((id:string)=>{
                    doc.COMMON_MODULE.debug("id recebido e meu user id", id,game.user.id);

                    return id != game.user.id
                } );

                let randomNumber:number =  Math.round(1000 * Math.random() ) + 1000  ;
                let randomIndex:number =  Math.round( userids.length * Math.random() )  ;
                randomIndex = (randomIndex==userids.length)?randomIndex-1:randomIndex;
                const userid:string = userids.at(randomIndex) as string;
                doc.COMMON_MODULE.debug(`Sending to player random: ${userid} , I am userid: ${game.user.id} and number random is ${randomNumber}`);
                let result = await commonSocket.executeIn("add",[userid], randomNumber, 1);
                doc.COMMON_MODULE.debug(`The player random calculated: ${result}`);

      
                commonSocket.executeIn("helloEveryOne", userids,"teste4");
                doc.COMMON_MODULE.debug(`Depois do teste4 seletivo: ${result}`);
            }
            catch(e)
            {
                doc.COMMON_MODULE.debug("Common socket error",e);
            }

            
        });
        
}