 
Hooks.on("onInitCommonModule",   () => {
	console.log("Loading Region Utils V1.1.1");
	 
  	
		document.COMMON_MODULE.REGION_UTILS = {
			sendMessageToChat : (senderid,message)=>{
			
				// create the message
				const chatData = {
					user: senderid,
					speaker: "Game Master",
					content: message,
					whisper: game.users.filter((u) => u.isGM).map((u) => u._id),
				};
				ChatMessage.create(chatData, {});
			},
		
			stop : (event)=>{ 
				const shape = event?.region?.shapes[0];
				console.log("event:",event,",shape:",shape);

				if(!shape)
				{
					console.error("shape not found");
					return;
				}
		
				const newX = shape.x + parseInt(shape.width/2);  
				const newY = shape.y + parseInt(shape.height/2);  

				const token = event?.data?.token;

				if(!shape)
					{
						console.error("token not found");
						return;
					}
				
				token.x = newX;
				token.y = newY;
			
				console.log("Token indo para x:".newX,",y:",newY);
				token.update({ x: token.x , y: token.y }) ;
				
			},
			toggleVisibilityRegions: async () =>{
				document.COMMON_MODULE.debug("toggleVisibilityRegions called");
				const activeScene = game.scenes.current;
				if(!activeScene)
				{
					document.COMMON_MODULE.log("No scene active");
					return;
				}

				
				activeScene.regions.forEach((region)=>{

						document.COMMON_MODULE.debug("region",region);
						
						region.update({
							visibility: !region.visibility  
						});
					
				});

			},



			registerKeybindings: async  ( ) => {
				game.keybindings.register(COMMON_REGISTERED_NAMES.MODULE_NAME,COMMON_REGISTERED_NAMES.TOOGLE_VISIBILITY, {
					name: "Alternar visão das regiões da cena",
					hint: "Liga/desliga visibilidade das regiões da cena atual.",
					editable: [
					{
						key: "KeyG",
						modifiers: ["Shift"]
					}
					],
					onDown: async () => {
						document.COMMON_MODULE.debug("onDown will be called");
			
						document.COMMON_MODULE.REGION_UTILS.toggleVisibilityRegions(); 
					},
					restricted: true,   // true = só GM
					reservedModifiers: [], // normalmente vazio
					precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
				}); 

			}
	
		};
	
	document.COMMON_MODULE.REGION_UTILS.registerKeybindings();

   });
   