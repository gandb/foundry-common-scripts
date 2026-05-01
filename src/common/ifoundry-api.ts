/**
 * Interface para abstração da API do Foundry VTT.
 * Permite injeção de dependência e mocking em testes.
 */
export interface IFoundryAPI {
  /** Métodos de manipulação de Hooks do Foundry */
  hooks: {
    /** Registra um callback para um evento de hook */
    on(event: string, callback: Function): void;
    /** Registra um callback que executa apenas uma vez */
    once(event: string, callback: Function): void;
    /** Dispara um hook para todos os listeners */
    callAll(event: string, data: any): void;
  };
  /** Cria uma mensagem de chat no Foundry */
  createChatMessage(payload: any): Promise<any>;
}
