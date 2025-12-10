 
 //UTILITARIO PARA CORRIGIR URL DE IMAGENS DE NPCS NO MUNDO ATUAL
CONFIG.debug.hooks = true;

const newImgPath = "modules/candlekeep-5ed/images/mobs"; //substitua com o caminho desejado

Hooks.on("ready", async  () => {
  console.log("Iniciando a alteração da URL!");
  await updateNpcImageBaseUrl(newImgPath);
});
  
/**
 * Atualiza a URL base da imagem de todos os NPCs do mundo,
 * mantendo o nome original do arquivo.
 * 
 * @param {string} newBaseUrl - A nova base da URL (sem o nome do arquivo).
 * */
  
async function updateNpcImageBaseUrl(newBaseUrl:any) {
  // Remove barra final se houver
  if (newBaseUrl.endsWith("/")) {
    newBaseUrl = newBaseUrl.slice(0, -1);
  }

  const npcs = game.actors.filter((actor:any) => actor.type === "npc");

  if (npcs.length === 0) {
    ui.notifications.warn("Nenhum NPC encontrado.");
    return;
  }

  for (let npc of npcs) {
    const oldImg = npc.img;
    const oldTokenImg = npc.prototypeToken?.texture?.src ?? oldImg;

    // Extrai o nome do arquivo da imagem antiga 
    const filenamePortrait = oldImg.split("/").pop();
    const filenameToken = oldTokenImg.split("/").pop();

    // Monta a nova URL com a base fornecida e o nome original do arquivo
    
    const newPortrait = `${newBaseUrl}/${filenamePortrait}`;
    const newToken = `${newBaseUrl}/${filenameToken}`;
  
    await npc.update({ 
      img: newPortrait,
      prototypeToken: {
        texture: {
          src: newToken
        }
      }
     });
    console.log(`NPC '${npc.name}' atualizado para imagem: ${newToken} and ${newPortrait} `);
  }

  ui.notifications.info(`Atualizadas as imagens de ${npcs.length} NPC(s).`);
} 