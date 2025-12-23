

'use strict'; 
 
const docRegionUtils:FoundryDocument = document as FoundryDocument;

const REGION_UTILS_REGISTERED_NAMES = {
	MODULE_NAME : "common-assets", 
	TOOGLE_VISIBILITY :  "common-assets-toogle-visibility-regions"
};


Hooks.on("onInitCommonModule",   () => {
	console.log("Loading Region Utils V1.1.1");
	 
  	
		docRegionUtils.COMMON_MODULE.REGION_UTILS = {
			sendMessageToChat : (senderid:string,message:string)=>{
			
				// create the message
				const chatData = {
					user: senderid,
					speaker: "Game Master",
					content: message,
					whisper: game.users.filter((u:any) => u.isGM).map((u:any) => u._id),
				};
				ChatMessage.create(chatData, {});
			},
		
			stop : (event:any)=>{ 
				const shape:any= event?.region?.shapes[0];
				console.log("event:",event,",shape:",shape);

				if(!shape)
				{
					console.error("shape not found");
					return;
				}


		
				const width: number = shape.width;
				const height: number = shape.height;
				const newX:number = shape.x as number + Math.round(width/2);  
				const newY:number = shape.y + Math.round(height/2);  

				const token = event?.data?.token;

				
				token.x = newX;
				token.y = newY;
			
				console.log("Token indo para x:" ,newX,",y:",newY);
				token.update({ x: token.x , y: token.y }) ;
				
			},
			toggleVisibilityRegions: async () =>{
				docRegionUtils.COMMON_MODULE.debug("toggleVisibilityRegions called");
				const activeScene = game.scenes.current;
				if(!activeScene)
				{
					docRegionUtils.COMMON_MODULE.log("No scene active");
					return;
				}

				
				activeScene.regions.forEach((region:any)=>{

						docRegionUtils.COMMON_MODULE.debug("region",region);
						
						region.update({
							visibility: !region.visibility  
						});
					
				});

			},



			registerKeybindings: async  ( ) => {
				game.keybindings.register(REGION_UTILS_REGISTERED_NAMES.MODULE_NAME ,REGION_UTILS_REGISTERED_NAMES.TOOGLE_VISIBILITY, {
					name: "Alternar visão das regiões da cena",
					hint: "Liga/desliga visibilidade das regiões da cena atual.",
					editable: [
					{
						key: "KeyG",
						modifiers: ["Shift"]
					}
					],
					onDown: async () => {
						docRegionUtils.COMMON_MODULE.debug("onDown will be called");
			
						docRegionUtils.COMMON_MODULE.REGION_UTILS.toggleVisibilityRegions(); 
					},
					restricted: true,   // true = só GM
					reservedModifiers: [], // normalmente vazio
					precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
				}); 

			}
	
		};
	
	docRegionUtils.COMMON_MODULE.REGION_UTILS.registerKeybindings();

   });
   