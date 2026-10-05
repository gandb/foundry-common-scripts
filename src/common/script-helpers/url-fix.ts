import { IGameContext } from "../igame-context";

//UTILITY TO FIX NPC IMAGE URLS IN THE CURRENT WORLD
const FIX_NPCs = false;

const newImgPath = "modules/candlekeep-5ed/images/mobs"; //replace with the desired path

Hooks.on("ready", async () => {
  await updateNpcImageBaseUrl(newImgPath);
});

/**
 * Updates the image base URL of every NPC in the world,
 * keeping the original file name.
 *
 * @param {string} newBaseUrl - The new URL base (without the file name).
 * */

async function updateNpcImageBaseUrl(newBaseUrl: any) {
  if (!FIX_NPCs) {
    return;
  }
  // Remove trailing slash if present
  if (newBaseUrl.endsWith("/")) {
    newBaseUrl = newBaseUrl.slice(0, -1);
  }

  const { injectController } = require("taulukko-commons");
  let gameContext: IGameContext | null = null;
  if (injectController.has("GameContext")) {
    gameContext = injectController.resolve("GameContext") as IGameContext;
  } else if (typeof game !== "undefined") {
    gameContext = game as any as IGameContext;
  }
  if (!gameContext?.actors) {
    ui.notifications.warn("GameContext não disponível.");
    return;
  }
  const npcs = gameContext.actors.filter((actor: any) => actor.type === "npc");

  if (npcs.length === 0) {
    ui.notifications.warn("Nenhum NPC encontrado.");
    return;
  }

  for (let npc of npcs) {
    const oldImg = npc.img;
    const oldTokenImg = npc.prototypeToken?.texture?.src ?? oldImg;

    // Extract the file name from the old image
    const filenamePortrait = oldImg.split("/").pop();
    const filenameToken = oldTokenImg.split("/").pop();

    // Build the new URL with the provided base and the original file name

    const newPortrait = `${newBaseUrl}/${filenamePortrait}`;
    const newToken = `${newBaseUrl}/${filenameToken}`;

    await npc.update({
      img: newPortrait,
      prototypeToken: {
        texture: {
          src: newToken,
        },
      },
    });
  }

  ui.notifications.info(`Atualizadas as imagens de ${npcs.length} NPC(s).`);
}
