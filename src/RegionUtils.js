 
Hooks.on("ready",   () => {
	console.log("Loading Region Utils V1.1.1");
 
	
	  document.regionUtils = {
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
		
	  }
	  
	  };
	   
		
   });
   
  