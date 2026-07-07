import { CacheReturnControl } from "../../common/cache-returns-control";
import { Socket, CALLBACK_FUNCTION_EVENT_NAME } from "../common-socket";
import { SubModuleBase } from "../../submodules/sub-module-base";
import { Log, injectController } from "taulukko-commons";
import { CommonModule } from "../../common-module";
import type { IGameContext } from "../../common/igame-context";
import type { IFoundryAPI } from "../../common/ifoundry-api"; // O caminho para este módulo estava incorreto.

const CALLBACK_SYSTEM_CALLBACK: string = "common.socket.chatmessage.callback";
const RETURN_CONTROL_NAME: string = "ChatSocketReturns";

export class ChatSocket extends SubModuleBase implements Socket {
  readonly #callbacks: Map<string, any> = new Map();

  private get gameContext(): IGameContext {
    let gameContextRef: IGameContext | undefined = undefined;
    const gameContext: IGameContext = (
      injectController.has("GameContext")
        ? (injectController.resolve("GameContext") as IGameContext)
        : gameContextRef
    ) as IGameContext;
    if (!gameContext) {
      throw new Error(
        "Required dependency 'GameContext' not registered and no fallback available",
      );
    }
    return gameContext;
  }

  public getCallback(type: string) {
    return this.#callbacks.get(type);
  }

  public setCallback(type: string, callback: any) {
    this.#callbacks.set(type, callback);
  }

  protected async initHooks() {
    let logguerRef: Log | undefined = undefined;
    const logguer: Log = (
      injectController.has("CommonLogguer")
        ? injectController.resolve("CommonLogguer")
        : logguerRef
    ) as Log;
    if (!logguer) {
      throw new Error(
        "Required dependency 'CommonLogguer' not registered and no fallback available",
      );
    }
    let socketRef: ChatSocket | undefined = undefined;
    const socket = (
      injectController.has("Socket")
        ? (injectController.resolve("Socket") as ChatSocket)
        : socketRef
    ) as ChatSocket;
    if (!socket) {
      throw new Error(
        "Required dependency 'Socket' not registered and no fallback available",
      );
    }
    let foundryRef: IFoundryAPI | undefined = undefined;
    const foundry: IFoundryAPI = (
      injectController.has("FoundryAPI")
        ? injectController.resolve("FoundryAPI")
        : foundryRef
    ) as IFoundryAPI;
    logguer.debug("CA: ChatSocket waiting for requirements modules...");

    foundry.hooks.once("onReadyCommonModule", async () => {
      let logguerRef2: Log | undefined = undefined;
      const logguer: Log = (
        injectController.has("CommonLogguer")
          ? injectController.resolve("CommonLogguer")
          : logguerRef2
      ) as Log;
      logguer.debug("Common Module ready in Chat Socket");
      socket.init();
    });

    foundry.hooks.on("createChatMessage", (message: any) => {
      let logguerRef2: Log | undefined = undefined;
      const logguer: Log = (
        injectController.has("CommonLogguer")
          ? injectController.resolve("CommonLogguer")
          : logguerRef2
      ) as Log;
      if (!logguer) {
        throw new Error(
          "Required dependency 'CommonLogguer' not registered and no fallback available",
        );
      }
      let commonModuleRef: CommonModule | undefined = undefined;
      const commonModule: CommonModule = (
        injectController.has("CommonModule")
          ? injectController.resolve("CommonModule")
          : commonModuleRef
      ) as CommonModule;
      if (!commonModule) {
        throw new Error(
          "Required dependency 'CommonModule' not registered and no fallback available",
        );
      }
      let socketRef: ChatSocket | undefined = undefined;
      const socket = (
        injectController.has("Socket")
          ? (injectController.resolve("Socket") as ChatSocket)
          : socketRef
      ) as ChatSocket;

      try {
        logguer.debug("createChatMessage recebido...");
        socket.cleanupRealChatMessage();
        setTimeout(() => socket.cleanupRealChatMessage(), 500);

        const eventReceived: string = message.flags?.[commonModule.name]?.type;
        if (!eventReceived) return;

        const payload: PayloadEvent = message.flags[
          commonModule.name
        ] as PayloadEvent;
        const broadcast = payload.users.length == 0;

        if (!broadcast) {
          const valid: boolean =
            payload.users.filter((id) => socket.gameContext.user?.id == id)
              .length == 1;
          if (!valid) {
            logguer.debug(
              "Ignorado pois não é para este usuário :",
              socket.gameContext.user?.id,
              ",payload:",
              payload,
            );
            return;
          }
        }

        logguer.debug("[Common Socket Chat Message] Evento recebido:", payload);

        if (socket.gameContext.user?.isGM && payload.onlyPlayers) {
          logguer.debug(
            "[|Common Socket Chat Message] Evento recebido para players e o receptor é GM, evento descartado :",
            payload,
          );
          return;
        } else if (!socket.gameContext.user?.isGM && payload.toGM) {
          logguer.debug(
            "[|Common Socket Chat Message] Evento recebido é pro GM e o receptor não é GM, evento descartado :",
            payload,
          );
          return;
        }

        const callback = socket.getCallback(payload.type);
        if (!callback) {
          logguer.debug(
            "[|Common Socket Chat Message] Evento recebido não registrado :",
            payload.type,
          );
          return;
        }

        if (payload.type == CALLBACK_SYSTEM_CALLBACK) {
          logguer.debug(
            "[|Common Socket Chat Message] Retorno do sistema :",
            payload,
          );
          callback({
            requestId: payload.data.originalRequestId,
            response: payload.data.response,
          });
          return;
        }

        let ret = callback(...payload.data);
        logguer.debug(
          "[Common Socket Chat Message] Retorno do callback :",
          payload,
          ",ret:",
          ret,
        );

        ret ??= { common_socket_chat_message_system_empty: true };
        logguer.debug(
          "createChatMessage, devolvendo pra quem pediu o retorno :",
          ret,
        );

        socket.sendMessage(
          CALLBACK_SYSTEM_CALLBACK,
          { response: ret, originalRequestId: payload.requestId },
          false,
          false,
          [payload.senderId],
        );
      } catch (e) {
        logguer.error("[NPC Portrait] Erro ao processar evento:", e);
      }
    });
  }

  protected async waitReady() {
    let logguerRef: Log | undefined = undefined;
    const logguer: Log = (
      injectController.has("CommonLogguer")
        ? injectController.resolve("CommonLogguer")
        : logguerRef
    ) as Log;
    if (!logguer) {
      throw new Error(
        "Required dependency 'CommonLogguer' not registered and no fallback available",
      );
    }
    let commonModuleRef: CommonModule | undefined = undefined;
    const commonModule: CommonModule = (
      injectController.has("CommonModule")
        ? injectController.resolve("CommonModule")
        : commonModuleRef
    ) as CommonModule;
    if (!commonModule) {
      throw new Error(
        "Required dependency 'CommonModule' not registered and no fallback available",
      );
    }
    let socketRef: ChatSocket | undefined = undefined;
    const socket = (
      injectController.has("Socket")
        ? (injectController.resolve("Socket") as ChatSocket)
        : socketRef
    ) as ChatSocket;
    if (!socket) {
      throw new Error(
        "Required dependency 'Socket' not registered and no fallback available",
      );
    }
    let foundryRef: IFoundryAPI | undefined = undefined;
    const foundry: IFoundryAPI = (
      injectController.has("FoundryAPI")
        ? injectController.resolve("FoundryAPI")
        : foundryRef
    ) as IFoundryAPI;
    const module = socket.gameContext.modules.get(commonModule.name);
    logguer.debug(`Common Socket initializing for ${commonModule.name}...`);

    if (!module?.active) {
      logguer.error(
        `Chat Socket | Someone tried to register module '${commonModule.name}', but no module with that name is active.`,
      );
      return undefined;
    }

    socket.register(CALLBACK_SYSTEM_CALLBACK, (data: any) => {
      let logguerRef2: Log | undefined = undefined;
      const logguer: Log = (
        injectController.has("CommonLogguer")
          ? injectController.resolve("CommonLogguer")
          : logguerRef2
      ) as Log;
      if (!logguer) {
        throw new Error(
          "Required dependency 'CommonLogguer' not registered and no fallback available",
        );
      }
      logguer.debug(
        "ChatSocket adicionando o retorno na pilha de retorno : ",
        data,
      );
      let returnsRef: CacheReturnControl<string, any> | undefined = undefined;
      const returns = (
        injectController.has(RETURN_CONTROL_NAME)
          ? (injectController.resolve(
              RETURN_CONTROL_NAME,
            ) as CacheReturnControl<string, any>)
          : returnsRef
      ) as CacheReturnControl<string, any>;
      if (returns.has(data.requestId)) {
        logguer.debug("CA: Já foi respondido antes : ", data);
        return;
      }
      returns.add(data.requestId, data.response);
    });
    foundry.hooks.callAll(CALLBACK_FUNCTION_EVENT_NAME, {});
  }

  private cleanupRealChatMessage() {
    let logguerRef: Log | undefined = undefined;
    const logguer: Log = (
      injectController.has("CommonLogguer")
        ? injectController.resolve("CommonLogguer")
        : logguerRef
    ) as Log;
    if (!logguer) {
      throw new Error(
        "Required dependency 'CommonLogguer' not registered and no fallback available",
      );
    }
    logguer.debug("[Common Socket Chat Message] cleanupRealChatMessage ");
    let elements = document.querySelectorAll(
      ".chat-message.message:not(.socket-chat-event)",
    );
    elements.forEach((element) => {
      if (
        (element as HTMLElement).innerHTML.indexOf("Common Socket Event") >= 0
      ) {
        element.classList.add("socket-chat-event");
      }
    });
  }

  private async sendMessage(
    eventName: string,
    data: any,
    onlyPlayers: boolean,
    toGM: boolean,
    userids: Array<string> | undefined = undefined,
  ) {
    let logguerRef: Log | undefined = undefined;
    const logguer: Log = (
      injectController.has("CommonLogguer")
        ? injectController.resolve("CommonLogguer")
        : logguerRef
    ) as Log;
    if (!logguer) {
      throw new Error(
        "Required dependency 'CommonLogguer' not registered and no fallback available",
      );
    }
    let socketRef: ChatSocket | undefined = undefined;
    const socket = (
      injectController.has("Socket")
        ? (injectController.resolve("Socket") as ChatSocket)
        : socketRef
    ) as ChatSocket;
    const whisper = Array.from(socket.gameContext.users?.values() || []);
    const requestId: string = Math.round(Math.random() * 1000000).toString();
    const users = userids ?? [];

    const payload: PayloadEvent = {
      requestId,
      senderId: socket.gameContext.user?.id || "",
      type: eventName,
      users,
      onlyPlayers,
      toGM,
      data,
    };

    logguer.debug(
      "[Common Socket Chat] Enviando mensagem com payload :",
      payload,
    );

    let foundryRef: IFoundryAPI | undefined = undefined;
    const foundry: IFoundryAPI = (
      injectController.has("FoundryAPI")
        ? injectController.resolve("FoundryAPI")
        : foundryRef
    ) as IFoundryAPI;
    await foundry.createChatMessage({
      content: "Common Socket Event - Ignore this message",
      whisper,
      flags: {
        "common-assets": payload,
      },
    });

    if (eventName == CALLBACK_SYSTEM_CALLBACK) return;

    logguer.debug(
      "[Common Socket Chat] Aguardando retorno do callback :",
      payload,
    );

    await socket.whaitFor(
      () => {
        let returnsRef2: CacheReturnControl<string, any> | undefined =
          undefined;
        const returns = (
          injectController.has(RETURN_CONTROL_NAME)
            ? (injectController.resolve(
                RETURN_CONTROL_NAME,
              ) as CacheReturnControl<string, any>)
            : returnsRef2
        ) as CacheReturnControl<string, any>;
        if (returns.has(requestId)) return true;
        return false;
      },
      60000,
      1000,
    );

    let returnsRef: CacheReturnControl<string, any> | undefined = undefined;
    const returns = (
      injectController.has(RETURN_CONTROL_NAME)
        ? (injectController.resolve(RETURN_CONTROL_NAME) as CacheReturnControl<
            string,
            any
          >)
        : returnsRef
    ) as CacheReturnControl<string, any>;
    return returns.get(requestId);
  }

  public async executeToGM(eventName: string, ...data: any): Promise<any> {
    let socketRef: ChatSocket | undefined = undefined;
    const socket = (
      injectController.has("Socket")
        ? (injectController.resolve("Socket") as ChatSocket)
        : socketRef
    ) as ChatSocket;
    return socket.sendMessage(eventName, data, false, true);
  }

  public async executeForAll(eventName: string, ...data: any): Promise<any> {
    let socketRef: ChatSocket | undefined = undefined;
    const socket = (
      injectController.has("Socket")
        ? (injectController.resolve("Socket") as ChatSocket)
        : socketRef
    ) as ChatSocket;
    return socket.sendMessage(eventName, data, false, false);
  }

  public async executeIn(
    eventName: string,
    users: Array<string>,
    ...data: any
  ): Promise<any> {
    let socketRef: ChatSocket | undefined = undefined;
    const socket = (
      injectController.has("Socket")
        ? (injectController.resolve("Socket") as ChatSocket)
        : socketRef
    ) as ChatSocket;
    return socket.sendMessage(eventName, data, false, false, users);
  }

  public async executeAsGM(eventName: string, ...data: any): Promise<any> {
    let socketRef: ChatSocket | undefined = undefined;
    const socket = (
      injectController.has("Socket")
        ? (injectController.resolve("Socket") as ChatSocket)
        : socketRef
    ) as ChatSocket;
    if (
      !socket.isReady ||
      !socket.isReadyToSendToGM ||
      !socket.gameContext.user?.isGM
    ) {
      throw new Error("Isnt ready to send to gm or you arent GM");
    }
    return socket.sendMessage(eventName, data, true, false);
  }

  public isReadyToSendToGM(): boolean {
    let socketRef: ChatSocket | undefined = undefined;
    const socket = (
      injectController.has("Socket")
        ? (injectController.resolve("Socket") as ChatSocket)
        : socketRef
    ) as ChatSocket;
    return socket.gameContext.user?.isGM === true;
  }

  public async register(eventName: string, callback: any): Promise<void> {
    let socketRef: ChatSocket | undefined = undefined;
    const socket = (
      injectController.has("Socket")
        ? (injectController.resolve("Socket") as ChatSocket)
        : socketRef
    ) as ChatSocket;
    socket.setCallback(eventName, callback);
  }

  public get originalSocket(): any {
    return this;
  }
}

interface PayloadEvent {
  requestId: string;
  senderId: string;
  type: string;
  onlyPlayers: boolean;
  users: Array<string>;
  toGM: boolean;
  data: any;
}

const chatSocketInstance = new ChatSocket();
const returnsControl = new CacheReturnControl<string, any>();
injectController.registerByName(RETURN_CONTROL_NAME, returnsControl);

export const chatSocketImplementation: Socket = chatSocketInstance;
