
import { CacheReturnControl } from "../../common/cache-returns-control";
import { Socket, CALLBACK_FUNCTION_EVENT_NAME } from "../common-socket";
import { SubModuleBase } from "../../submodules/sub-module-base";
import { Log, injectController } from "taulukko-commons";
import { CommonModule } from "../../common-module";


const CALLBACK_SYSTEM_CALLBACK: string = "common.socket.chatmessage.callback";


//socketlib Implementation
export class ChatSocket extends SubModuleBase implements Socket {


    readonly #callbacks: Map<string, any> = new Map();
    readonly #returns: CacheReturnControl<string, any> = new CacheReturnControl();

    protected initHooks(): void {

        const logguer: Log = injectController.resolve("CommonLogguer");
        logguer.debug("CA: ChatSocket waiting for requirements modules...");

        Hooks.once("onReadyCommonModule", async () => {
            const logguer: Log = injectController.resolve("CommonLogguer");
            logguer.debug("Common Module ready in Chat Socket");
            this.init();

        });



        Hooks.on('createChatMessage', (message: any) => {
            const logguer: Log = injectController.resolve("CommonLogguer");
            const commonModule: CommonModule = injectController.resolve("CommonModule");
            try {
                logguer.debug("createChatMessage recebido...");
                this.cleanupRealChatMessage();
                setTimeout(this.cleanupRealChatMessage, 500);
                // Verifica se é um evento nosso
                const eventReceived: string = message.flags?.[commonModule.name]?.type;

                if (!eventReceived) {
                    return;
                }

                const payload: PayloadEvent = message.flags[commonModule.name] as PayloadEvent;

                const broadcast = payload.users.length == 0;

                if (!broadcast) {
                    const valid: boolean = payload.users.filter(id => game.user.id == id).length == 1;
                    if (!valid) {
                        logguer.debug("Ignorado pois não é para este usuário :", game.user.id, ",payload:", payload, ", users:", payload.users, ",usersFiltered:", payload.users.filter(id => game.user.id == id));
                        return;
                    }

                }


                logguer.debug('[Common Socket Chat Message] Evento recebido:', payload);
                if (game.user.isGM && payload.onlyPlayers) {
                    logguer.debug('[|Common Socket Chat Message] Evento recebido para players e o receptor é GM, evento descartado :', payload);
                    return;

                }
                else if (!game.user.isGM && payload.toGM) {
                    logguer.debug('[|Common Socket Chat Message] Evento recebido é pro GM e o receptor não é GM, evento descartado :', payload);
                    return;
                }

                const callback = this.#callbacks.get(payload.type);
                if (!callback) {
                    logguer.debug('[|Common Socket Chat Message] Evento recebido não registrado :', payload.type, " para o payload : ", payload);
                    return;
                }
                logguer.debug('[|Common Socket Chat Message] Chamando callback com dados :', payload);

                if (typeof callback === 'function') {
                    logguer.debug('[|Common Socket Chat Message] callback é uma função como esperado :', callback);
                }
                else {
                    logguer.debug('[|Common Socket Chat Message] algo deu erroad, callback não é uma função como esperado :', callback);
                }
                if (payload.type == CALLBACK_SYSTEM_CALLBACK) {
                    logguer.debug('[|Common Socket Chat Message] Retorno do sistema :', payload);
                    callback({ requestId: payload.data.originalRequestId, response: payload.data.response });
                    return;
                }

                let ret = callback(...payload.data);
                logguer.debug('[Common Socket Chat Message] Retorno do callback :', payload, ",ret:", ret);


                ret ??= { common_socket_chat_message_system_empty: true };
                logguer.debug('createChatMessage, devolvendo pra quem pediu o retorno :', ret);
                this.sendMessage(CALLBACK_SYSTEM_CALLBACK, { response: ret, originalRequestId: payload.requestId }, false, false, [payload.senderId]);
                return;

            } catch (e) {
                logguer.error('[NPC Portrait] Erro ao processar evento:', e);
            }
        });
    }
    protected async waitReady() {
        const logguer: Log = injectController.resolve("CommonLogguer");
        const commonModule: CommonModule = injectController.resolve("CommonModule");
        const module = game.modules.get(commonModule.name);
        logguer.debug(`Common Socket initializing for ${commonModule.name}...`);

        if (!module?.active) {
            logguer.error(`Chat Socket | Someone tried to register module '${commonModule.name}', but no module with that name is active. As a result the registration request has been ignored.`);
            return undefined;
        }



        this.register(CALLBACK_SYSTEM_CALLBACK, (data: any) => {
            const logguer: Log = injectController.resolve("CommonLogguer");
            const socket: ChatSocket = injectController.resolve("Socket");
            logguer.debug("CA: ChatSocket adicionando o retorno na pilha de retorno : ", data);
            const anotherUserAnswerBefore: boolean = socket.#returns.has(data.requestId);
            if (anotherUserAnswerBefore) {
                logguer.debug("CA: Já foi respondido antes : ", data);
                return;
            }
            socket.#returns.add(data.requestId, data.response);

        });


        Hooks.callAll(CALLBACK_FUNCTION_EVENT_NAME, {});
    }



    private cleanupRealChatMessage() {
        const logguer: Log = injectController.resolve("CommonLogguer");
        logguer.debug('[Common Socket Chat Message] cleanupRealChatMessage ');
        let elements = document.querySelectorAll(".chat-message.message:not(.socket-chat-event)");// not work the negation
        logguer.debug('[Common Socket Chat Message] cleanupRealChatMessage elements size ', elements.length);
        elements.forEach(element => {
            if (element.innerHTML.indexOf("Common Socket Event") >= 0) {
                element.classList.add("socket-chat-event");
            }

        });
    }

    private async sendMessage(eventName: string, data: any, onlyPlayers: boolean, toGM: boolean, userids: Array<string> | undefined = undefined) {

        const logguer: Log = injectController.resolve("CommonLogguer");

        const whisper = Array.from(game.users?.values());

        const requestId: string = Math.round((Math.random() * 1000000)).toString();

        const users = userids ?? [];

        const payload: PayloadEvent = {
            requestId,
            senderId: game.user.id,
            type: eventName,
            users,
            onlyPlayers,
            toGM,
            data
        };

        logguer.debug('[Common Socket Chat] Enviando mensagem com payload :', payload, ",time:", new Date());

        await ChatMessage.create({
            content: 'Common Socket Event - Ignore this message', // Invisível pra maioria
            whisper,
            flags: {
                'common-assets': payload
            }
        });

        if (eventName == CALLBACK_SYSTEM_CALLBACK) {
            logguer.debug('[Common Socket Chat] Ignorando callback pois é mensagem de sistema :', payload);
            return;
        }


        logguer.debug('[Common Socket Chat] Aguardando retorno do callback :', payload, ",time:", new Date());

        await this.whaitFor(() => {
            const logguer: Log = injectController.resolve("CommonLogguer");
            if (this.#returns.has(requestId)) {
                logguer.debug('Encontrado o resultado para requestId:', requestId, " , returns:", this.#returns);
                return true;
            }
            logguer.debug('Ainda não encontrado o resultado para requestId:', requestId, " , returns:", this.#returns);

            return false;

        }, 60000, 1000);

        if (!this.#returns.has(requestId)) {
            logguer.debug('[Common Socket Chat] Timeout ao processar evento :', payload, ",callbacks:", this.#returns, ",time:", new Date());
            return undefined;
        }
        const ret = this.#returns.get(requestId);

        return ret;

    }

    public async executeToGM(eventName: string, ...data: any): Promise<any> {
        return this.sendMessage(eventName, data, false, true);
    }

    public async executeForAll(eventName: string, ...data: any): Promise<any> {
        return this.sendMessage(eventName, data, false, false);
    }

    public async executeIn(eventName: string, users: Array<string>, ...data: any): Promise<any> {
        return this.sendMessage(eventName, data, false, false, users);
    }

    public async executeAsGM(eventName: string, ...data: any): Promise<any> {

        if (!this.isReady || !this.isReadyToSendToGM || !game.user.isGM) {
            throw new Error("Isnt ready to send to gm or you arent GM");
        }

        return this.sendMessage(eventName, data, true, false);

    }

    public isReadyToSendToGM(): boolean {
        return (game.user as any) || (game.users as any);
    }

    public async register(eventName: string, callback: any): Promise<void> {
        this.#callbacks.set(eventName, callback);
    }

    public get originalSocket(): any {
        return this;
    }
};

interface PayloadEvent {
    requestId: string;
    senderId: string;
    type: string;
    onlyPlayers: boolean;
    users: Array<string>
    toGM: boolean;
    data: any;
}


export const chatSocketImplementation: Socket = new ChatSocket();
