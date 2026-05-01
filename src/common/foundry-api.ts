import type { IFoundryAPI } from "./ifoundry-api";

/**
 * Implementação concreta de IFoundryAPI.
 * Abstração sobre a API global do Foundry VTT (Hooks, game, etc).
 *
 * **Registro DI:** `"FoundryAPI"` via `injectController.registerByName()`
 * **Dependência:** Requer `game` estar disponível ( Foundry VTT runtime)
 *
 * @example
 * ```typescript
 * const foundryApi = injectController.resolve<IFoundryAPI>("FoundryAPI");
 * foundryApi.hooks.on("init", () => console.log("Init!"));
 * ```
 */
export class FoundryAPI implements IFoundryAPI {
  public hooks = {
    on: (event: string, callback: (...args: unknown[]) => void): void => {
      Hooks.on(event, callback);
    },
    once: (event: string, callback: (...args: unknown[]) => void): void => {
      Hooks.once(event, callback);
    },
    callAll: (event: string, data: unknown): void => {
      Hooks.callAll(event, data);
    },
  };

  /**
   * Cria uma mensagem de chat no Foundry VTT.
   * @param payload - Dados da mensagem (content, speaker, etc.)
   * @returns Promessa com a mensagem criada
   */
  public async createChatMessage(payload: unknown): Promise<unknown> {
    return await (
      game as unknown as {
        messages: { create: (p: unknown) => Promise<unknown> };
      }
    ).messages.create(payload);
  }
}
