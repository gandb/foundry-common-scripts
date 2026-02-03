 
/**
 * TODO:
 * 1-Alterar o Atributo Honrror to HERO-OK
 * 2-Remover habilidade Honrror para NPCS - OK
 * 3-Remover a edição para os jogadors - OK
 * 4-Melhorar o código (ver abaixo)
 * 4.1-Tentar alterar o atributo dinamicamente via objeto tanto quanto possível - OK (não tem como)
 * 4.2-Adicionar a classe num arquivo CSS se possível-OK
 * 4.3-Ao clicar no atributo, abrir uma janela explicando como usar, como ganhar e pra quele serve. -OK
 * 4.4-Remover os logs indesejáveis. -OK
 * 4.5-Somente chamar tudo isto depois que o componente common estiver criado pois ele chama varias 
 * funcoes de log do commons por isto tem que aguardar - OK
 * 5-Ao clicar na caixa de texto surge a opção botão 1/2, + e cancelar em vez de ser editável pra 
 * facilitar pro GM. 
 * 6-Se já não estiver, logar a informação no chat (pode ser incorreto mesmo o texto, isso não se importo). 
 * 7-Adicionar em configurações a opção de habilitar ou não esta feature 
 * 8-Usar o conhecimento do item 7 pra habilitar ou não iniciar com o debug ligado.
 */



const doc :FoundryDocument = document as FoundryDocument;
 
 

function removeAttribute(sheet:Sheet)
{
	
	let htmldivs = document.querySelectorAll("div.ability-score[data-ability='hon']");
	if(htmldivs.length==0)
	{
		doc.COMMON_MODULE.debug(`Hability hero: not found divs to remove for npc`);
		return;
	}
	doc.COMMON_MODULE.debug(`Hability hero removed, npc sheet detected`);
	htmldivs[0].remove();
}

function addEditButtonsToHeroPoints(parent:HTMLElement){
	if(!game.user.isGM){
		return;
	}

	let elements:NodeList  =  parent?.querySelectorAll("div.mod span.operator.increment") as NodeList	;
	if(elements.length==0)
	{
		doc.COMMON_MODULE.error(`Hability Hero operator increment not found`);
		return;
	}
	let increment = elements.item(0) as HTMLElement;
	increment.onclick = (e)=>{
		e.preventDefault();
		doc.COMMON_MODULE.info(`Hability hero increment hero points started`);
	};
	elements  =  parent?.querySelectorAll("div.mod span.operator.reduce") as NodeList	;
	if(elements.length==0)
	{
		doc.COMMON_MODULE.error(`Hability Hero operator reduce not found`);
		return;
	}
	increment = elements.item(0) as HTMLElement;
	increment.onclick = (e)=>{
		e.preventDefault();
		doc.COMMON_MODULE.info(`Hability hero decrement hero points started`);
	}; 
}


function createDialog(element: HTMLElement) {
		let dialog:any = {};

		element.onclick = (e)=>{
			e.preventDefault();
			doc.COMMON_MODULE.log(`clicou na habilidade`); 
			

			const cancelButton = doc.COMMON_MODULE.DIALOG_UTILS.createButton ("cancel","Cancelar",true,"action", (html:any)=>{
				dialog.close();
			});			
				doc.COMMON_MODULE.log("Hero Points dialog closed.");
			dialog  = doc.COMMON_MODULE.DIALOG_UTILS.createDialog ("Sobre Hero Points","",`
		<div class="hero-points-info-content"> 
			<img class="heroic-action-img"
				src="/modules/common-assets/images/cover/heropoint.webp"
				alt="Ícone representando uma ação heróica em um RPG de fantasia"
				/>  

			<p>
				<strong>Hero Points</strong> são semelhantes a pontos de inspiração, mas não são limitados a 1. 
				Você começa com zero pontos e eles são acumulativos, diferente de inspiração, em que se pode ter apenas 1 ponto ativo.
			</p>

			<p>
				<strong>Como obter:</strong> quando chegar na sua vez, se você fizer algo que incremente não somente o seu 
				background como o de algum colega (semelhante ao ponto de inspiração, mas sem precisar se colocar em situação ruim),
				você ganha 1 ponto. A ação deve melhorar a história tanto do seu personagem quanto a dos demais jogadores.
			</p>

			<p>
				<strong>Exemplo de ação heróica:</strong> você sabe que um meio-orc do grupo tem fobia de aranha. 
				O mestre descreve uma aranha se aproximando e o jogador dono do personagem não percebe. 
				Você decide atacar a aranha antes que seu colega se desespere e note a presença dela. 
				Ou, se você é um bardo e sabe que um dos jogadores teve um amor perdido, 
				canta uma música na sua rodada para dar inspiração dizendo que é sobre o amor perdido desse personagem. 
				É importante que tudo faça sentido na história atual, na história do outro jogador e na sua própria. 
				Você pode inclusive ajustar a narração, por exemplo, inventando que havia uma aranha que o mestre nem citou 
				e dizer que a matou com uma flecha antes que seu amigo entrasse em pânico.
			</p>

			<p>
				A jogada deve ser rápida e já pensada durante a vez dos outros; você não pode parar para planejar apenas quando sua vez começa. 
				Ela precisa ser ágil para incrementar a narração. Se tudo isso for atendido e o mestre concordar, 
				1 ponto de heroísmo é acrescentado ao personagem.
			</p>

			<p>
				<strong>Ação Heróica (gasto):</strong> o ponto ganho pode ser gasto para realizar uma ação especial envolvendo dois personagens; 
				o alvo pode ser um jogador ou um NPC, aliado ou inimigo.
			</p>

			<p>
				<strong>Como reduzir os pontos:</strong> os pontos não são gastos de 1 em 1 e apenas o Mestre pode reduzir ou aumentar o total. 
				Quando os pontos são gastos, divide-se o total por 2 (arredondando para baixo), com mínimo de 1. 
				Exemplos: se você tem 5 pontos, passa a ter 2; se tem 3, passa a ter 1; se tem 1 ponto, passa a ter 0.
			</p>
		</div>
					`,[cancelButton],new Array());
			
	};
}


function changeHabilityHonrrorToHeroPoints(sheet:Sheet){
	let htmldivs = document.querySelectorAll("div.ability-score.flipped[data-ability='hon'] a");

	if(htmldivs.length==0)
	{

		doc.COMMON_MODULE.error(`Hability hero not enable to convert for hero, your cmpaing not use? Code error: 01`);
		return;
	}

	doc.COMMON_MODULE.debug(`Hability hero found : ` +  htmldivs.length);

	let htmlScores = document.querySelectorAll("div.ability-score.flipped[data-ability='hon'] div.score");

	if(htmlScores.length==0)
	{
		doc.COMMON_MODULE.error(`Hability hero not enable to convert for hero, your cmpaing not use? Code error: 02`);
		return;
	}


	let score:string = htmlScores.item(0).innerHTML;



	if(!game.user.isGM){
		let scoreInput = document.querySelectorAll("div.ability-score.flipped[data-ability='hon'] input");

		if(scoreInput.length==0)
		{
			scoreInput = document.querySelectorAll("div.ability-score.flipped[data-ability='hon'] div.score");
			if(scoreInput.length==0)
			{
				doc.COMMON_MODULE.error(`Hability hero not enable to convert for hero, your cmpaing not use? Code error:03`);
				return;
			}
			 
			score = (scoreInput.item(0) as HTMLDivElement).innerHTML; 
		}
		else{
			score = (scoreInput.item(0) as HTMLInputElement).value;
		}

	}
 

	doc.COMMON_MODULE.debug(`Hability hero score: `,score);

	let element :HTMLElement =  htmldivs.item(0) as HTMLElement; 
	const parent = element.parentElement;

	(parent as HTMLElement).innerHTML  = `
		<label class="common-assets attribute">hero</label>
		<div class="mod">
			<span class="operator reduce" >-</span>
			<span class="operator increment" >+</span>
		</div>
		<div class="score">${score}</div>
		`;

	addEditButtonsToHeroPoints(parent as HTMLElement);


	htmldivs = document.querySelectorAll("div.ability-score.flipped[data-ability='hon'] label");

	if(htmldivs.length==0)
	{
		doc.COMMON_MODULE.warn(`Hability hero not enable to convert for hero, your cmpaing not use? Code error: 01`);
		return;
	}
	element =   htmldivs.item(0) as HTMLElement;

	createDialog(element); 

}


function initializeHabilityHero(){  
	Hooks.on("renderDocumentSheetV2", async (data:any ) => {
		const sheet :Sheet  = data as Sheet;
		doc.COMMON_MODULE.debug(`Hability hero called  `,sheet);

		if(sheet.actor.type!="character")
		{
			removeAttribute(sheet);
			doc.COMMON_MODULE.debug(`Hability hero ignoreted sheet because isnt a player sheet, type:`,sheet.actor.type!);
			return;
		}

		changeHabilityHonrrorToHeroPoints(sheet);
	
	});

}


Hooks.on("onReadyCommonModule", async () => {
	doc.COMMON_MODULE.info("Starting Hability hero processing");
	initializeHabilityHero();
	doc.COMMON_MODULE.info("Hability hero initialized");
});
