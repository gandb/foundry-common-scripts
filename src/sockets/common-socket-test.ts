import { Log, injectController } from "taulukko-commons";
import { Socket } from "./common-socket";
import type { IGameContext } from "../common/igame-context";

let doc: FoundryDocument = document as FoundryDocument;

function showMessage(message: string) {
  const logguer: Log = injectController.resolve("CommonLogguer");
  logguer.debug(`Message: ${message}!`);
}

function add(a: number, b: number) {
  const logguer: Log = injectController.resolve("CommonLogguer");
  logguer.debug("The addition is performed.");
  return a + b;
}

export function socketTest() {
  const gameContext: IGameContext = injectController.resolve(
    "GameContext",
  ) as IGameContext;

  Hooks.once("onReadyCommonSocket", async () => {
    const logguer: Log = injectController.resolve("CommonLogguer");
    const commonSocket: Socket = injectController.resolve("Socket");
    logguer.debug("onReadyCommonSocket 20");

    //configuration of socket
    commonSocket.register("showMessage", showMessage);
    commonSocket.register("add", add);

    logguer.debug("Socketlib finish the register events");

    try {
      if (commonSocket.isReadyToSendToGM()) {
        logguer.debug("Gm esta pronto pra receber mensagens test1");
        commonSocket.executeForAll("showMessage", "test1");
        logguer.debug("Depois de usar executeForAll test1");

        if (gameContext.user?.isGM) {
          logguer.debug(`Before executeAsGM add 5+6`);
          let result = await commonSocket.executeAsGM("add", 5, 6);
          logguer.debug(`The result of executeAsGM add 5+6 is: ${result}`);
          //esta mensagem jamais deveria aparecer no GM, só nos usuarios
          await commonSocket.executeAsGM("showMessage", "test2");
          logguer.debug("depois de executeAsGM test2");
        } else {
          commonSocket.executeForAll("showMessage", "test3");
          logguer.debug("Depois de executeForAll");

          try {
            //esta mensagem jamais deveria ser entregue, deveria retornar erro
            logguer.debug("Before executeAsGM test4");
            await commonSocket.executeAsGM("showMessage", "test4");
            logguer.debug("depois de executeAsGM test4");
          } catch (e) {
            logguer.debug(
              "erro ao tentar executar executeAsGM sendo apenas jogador",
              e,
            );
          }
        }
      } else {
        logguer.debug(
          "A minha implementacao notou que o gm nao foi carregado ainda 1",
        );
      }
      logguer.debug("Before executeForAll test5");
      commonSocket.executeForAll("showMessage", "test5");
      logguer.debug("depois de executeForAll test5");

      logguer.debug("Before executeToGM test6");
      commonSocket.executeToGM("showMessage", "test6");
      logguer.debug("depois de executeToGM test6");

      let userids: string[] = Array.from(
        (
          gameContext.users as {
            values(): IterableIterator<{ id: string }>;
          } | null
        )?.values() || [],
      ).map((u: { id: string }) => u.id);

      logguer.debug("Meu userid", gameContext.user?.id);

      userids = userids.filter((id: string) => {
        const logguer: Log = injectController.resolve("CommonLogguer");
        logguer.debug("id recebido e meu user id", id, gameContext.user?.id);
        return id != gameContext.user?.id;
      });

      logguer.debug("Ids dos outros jogadores", userids);

      let randomNumber: number = Math.round(1000 * Math.random()) + 1000;
      let randomIndex: number = Math.round(userids.length * Math.random());
      randomIndex =
        randomIndex == userids.length ? randomIndex - 1 : randomIndex;
      const userid: string = userids.at(randomIndex) as string;
      logguer.debug(
        `Sending to player random: ${userid} , I am userid: ${gameContext.user?.id} and number random is ${randomNumber}`,
      );
      let result = await commonSocket.executeIn(
        "add",
        [userid],
        randomNumber,
        1,
      );
      logguer.debug(`The player random calculated: ${result}`);

      logguer.debug(`Antes do executeIn test7`);
      commonSocket.executeIn(
        "showMessage",
        [userid],
        "teste7:" + gameContext.user?.id,
      );
      logguer.debug(`Depois do showMessage test7`);
    } catch (e) {
      logguer.debug("Common socket error", e);
    }
  });
}
