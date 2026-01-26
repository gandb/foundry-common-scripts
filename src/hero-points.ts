"user strict";

/**
 * TODO:
 * 1-Alterar o Atributo Honrror to HERO-OK
 * 2-Remover habilidade Honrror para NPCS
 * 3-Melhorar o códiog
 * 3.1-Tentar alterar o atributo dinamicamente via objeto tanto quanto possível
 * 3.2-Adicionar a classe num arquivo CSS se possível
 * 3.3-Ao clicar no atributo, abrir uma janela explicando como usar, como ganhar e pra quele serve.
 * 3.4-Remover os logs indesejáveis.
 * 3.5-Somente chamar tudo isto depois que o componente common estiver criado pois ele chama varias funcoes de log do commons por isto tem que aguardar
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



Hooks.on("renderDocumentSheetV2", async (sheet) => {
	doc.COMMON_MODULE.debug(`Hability honror called  `,sheet);
	
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

	const score:string = htmlScores.item(0).innerHTML;
	let element :HTMLElement =  htmldivs.item(0) as HTMLElement;
	const innerHTML:string = (element.parentElement as HTMLElement).innerHTML;
	const parent = element.parentElement;
 
	(parent as HTMLElement).innerHTML  = `
		<style>
			LABEL.common-assets.attribute{
			position: relative;
			width: 64px;
			height: 64px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			font-family: var(--dnd5e-font-roboto);
			padding-top: 0px;
			filter: drop-shadow(0 0 6px var(--dnd5e-shadow-45));
			pointer-events: all;
			text-transform: uppercase;
			color: rgb(159, 146, 117);
			color-scheme: dark;
			}
		</style>
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

	element.onclick = (e)=>{
		e.preventDefault();
		doc.COMMON_MODULE.log(`clicou na habilidade`);
	 
	};
});