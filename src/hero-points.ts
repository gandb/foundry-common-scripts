 
/**
 * TODO:
 * 1-Alterar o Atributo Honrror to HERO-OK
 * 2-Remover habilidade Honrror para NPCS - OK
 * 3-Remover a edição para os jogadors - OK
 * 4-Melhorar o código (ver abaixo)
 * 4.1-Tentar alterar o atributo dinamicamente via objeto tanto quanto possível - OK (não tem como)
 * 4.2-Adicionar a classe num arquivo CSS se possível-OK
 * 4.3-Ao clicar no atributo, abrir uma janela explicando como usar, como ganhar e pra quele serve. -OK
 * 4.4-Remover os logs indesejáveis.
 * 4.5-Somente chamar tudo isto depois que o componente common estiver criado pois ele chama varias funcoes de log do commons por isto tem que aguardar
 * 5-Ao clicar na caixa de texto surge a opção botão 1/2, + e cancelar em vez de ser editável pra facilitar pro GM. 
 * 6-Se já não estiver, logar a informação no chat.
 * 7-implementar a funcao removeAttribute para remover dos npcs
 * 8-Adicionar em configurações a opção de habilitar ou não esta feature
 * 9-Se não corrigiu o item 2 corrigir....
 */

const doc :FoundryDocument = document as FoundryDocument;



function cleanupEvents(element:Node) :HTMLElement{
  const newElement = element.cloneNode(true);
  if(!element.parentElement)
  {
	doc.COMMON_MODULE.error(`Hability honror haven´t parent?`);
	throw Error("Hability honror haven´t parent?");
  }

  (element.parentNode as HTMLElement).replaceChild(newElement, element);
  return newElement as HTMLElement;  
}

function removeAttribute(sheet:Sheet)
{
	doc.COMMON_MODULE.debug(`Hability honror starting removing, npc sheet detected`);
	let htmldivs = document.querySelectorAll("div.ability-score[data-ability='hon']");
	if(htmldivs.length==0)
	{
		doc.COMMON_MODULE.debug(`Hability honror: not found divs to remove for npc`);
		return;
	}
	doc.COMMON_MODULE.debug(`Hability honror removed, npc sheet detected`);
	htmldivs[0].remove();
}

Hooks.on("renderDocumentSheetV2", async (data:any ) => {
	const sheet :Sheet  = data as Sheet;
	doc.COMMON_MODULE.debug(`Hability honror called  `,sheet);

	if(sheet.actor.type!="character")
	{
		removeAttribute(sheet);
		doc.COMMON_MODULE.debug(`Hability honror ignoreted sheet because isnt a player sheet, type:`,sheet.actor.type!);
		return;
	}
	
//data-ability="hon"
	let htmldivs = document.querySelectorAll("div.ability-score.flipped[data-ability='hon'] a");

	if(htmldivs.length==0)
	{
		doc.COMMON_MODULE.warning(`Hability honror not enable to convert for hero, your cmpaing not use? Code error: 01`);
		return;
	}

	doc.COMMON_MODULE.debug(`Hability honror found : ` +  htmldivs.length);

	let htmlScores = document.querySelectorAll("div.ability-score.flipped[data-ability='hon'] div.score");

	if(htmlScores.length==0)
	{
		doc.COMMON_MODULE.warning(`Hability honror not enable to convert for hero, your cmpaing not use? Code error: 02`);
		return;
	}


	let score:string = htmlScores.item(0).innerHTML;



	if(!game.user.isGM){
		let scoreInput = document.querySelectorAll("div.ability-score.flipped[data-ability='hon'] input");

		if(scoreInput.length==0)
		{
			doc.COMMON_MODULE.warning(`Hability honror not enable to convert for hero, your cmpaing not use? Code error:03`);
			return;
		}

		score = (scoreInput.item(0) as HTMLInputElement).value;
	}


	doc.COMMON_MODULE.debug(`Hability honror score: `,score);
 

	let element :HTMLElement =  htmldivs.item(0) as HTMLElement;
	const innerHTML:string = (element.parentElement as HTMLElement).innerHTML;
	const parent = element.parentElement;
 
	(parent as HTMLElement).innerHTML  = `
		<label class="common-assets attribute">hero</label>
		<div class="mod">
            <span class="sign">+</span>0
        </div>
		<div class="score">${score}</div>
		`;

	htmldivs = document.querySelectorAll("div.ability-score.flipped[data-ability='hon'] label");

	if(htmldivs.length==0)
	{
		doc.COMMON_MODULE.warning(`Hability honror not enable to convert for hero, your cmpaing not use? Code error: 01`);
		return;
	}
	element =   htmldivs.item(0) as HTMLElement;

	let dialog:any = {};

	element.onclick = (e)=>{
		e.preventDefault();
		doc.COMMON_MODULE.log(`clicou na habilidade`); 
		 

		const cancelButton = doc.COMMON_MODULE.DIALOG_UTILS.createButton ("cancel","Cancelar",true,"action", (html:any)=>{
			dialog.close();
		});			
			doc.COMMON_MODULE.log("Hero Points dialog closed.");
		const dialog:any = doc.COMMON_MODULE.DIALOG_UTILS.createDialog ("Sobre Hero Points","",`
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
});