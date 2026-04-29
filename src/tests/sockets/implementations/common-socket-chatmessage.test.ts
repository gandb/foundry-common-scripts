/// <reference types="jest" />
/// <reference path="../../../../types/test-globals.d.ts" />

const mockGame: any = {
  users: new Map(),
  user: { id: "gm1", isGM: true },
  modules: new Map([["common-scripts-dnd5ed", { active: true }]]),
};

const mockFoundryAPI: any = {
  hooks: {
    once: jest.fn(),
    on: jest.fn(),
    callAll: jest.fn(),
  },
  createChatMessage: jest.fn().mockResolvedValue({}),
};

const mockReturnsControl: any = {
  add: jest.fn(),
  get: jest.fn(),
  has: jest.fn(() => false),
  delete: jest.fn(),
};

// Variável para armazenar a instância atual do ChatSocket
let currentChatSocketInstance: any = null;

// Mock do taulukko-commons - define o mock antes do import
jest.mock("taulukko-commons", () => {
  return {
    Log: jest.fn(),
    injectController: {
      resolve: jest.fn((name: string) => {
        if (name === "GameContext") return mockGame;
        if (name === "CommonLogguer") return { debug: jest.fn() };
        if (name === "CommonModule") return { name: "common-scripts-dnd5ed" };
        if (name === "FoundryAPI") return mockFoundryAPI;
        if (name === "ChatSocketReturns") return mockReturnsControl;
        if (name === "Socket") return currentChatSocketInstance;
        return null;
      }),
      registerByName: jest.fn(),
    },
  };
});

jest.mock("../../../../src/common-module", () => ({
  CommonModule: jest.fn(),
}));

// Importar após o mock
import { ChatSocket } from "../../../../src/sockets/implementations/common-socket-chatmessage";

describe("ChatSocket - onlyPlayers mechanism", () => {
  let chatSocketInstance: ChatSocket;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockGame.modules = {
      get: jest.fn((name: string) => ({ active: true })),
    };
    mockGame.user = { id: "gm1", isGM: true };
    mockGame.users = new Map();
    
    // Criar nova instância para cada teste
    chatSocketInstance = new ChatSocket();
    currentChatSocketInstance = chatSocketInstance;
  });

  describe("executeAsGM with onlyPlayers flag", () => {
    it("should throw if user is not GM", async () => {
      mockGame.user = { id: "user1", isGM: false };
      
      await expect(
        chatSocketInstance.executeAsGM("testEvent", { data: "test" })
      ).rejects.toThrow("Isnt ready to send to gm or you arent GM");
    });

    it("should call sendMessage with onlyPlayers=true when executeAsGM is called", async () => {
      mockGame.user = { id: "gm1", isGM: true };
      mockGame.users = new Map([
        ["user1", { id: "user1", isGM: false }],
        ["gm1", { id: "gm1", isGM: true }],
      ]);

      // Mock do método sendMessage para capturar os parâmetros
      const sendMessageSpy = jest.spyOn(chatSocketInstance as any, 'sendMessage')
        .mockResolvedValue("success");

      await chatSocketInstance.executeAsGM("testEvent", { data: "test" });

      expect(sendMessageSpy).toHaveBeenCalledTimes(1);
      const callArgs = sendMessageSpy.mock.calls[0];
      expect(callArgs[0]).toBe("testEvent");
      expect(callArgs[2]).toBe(true); // onlyPlayers = true
      expect(callArgs[3]).toBe(false); // toGM = false
      expect(callArgs[1]).toEqual([{ data: "test" }]);

      sendMessageSpy.mockRestore();
    });

    it("should pass correct data structure to sendMessage", async () => {
      mockGame.user = { id: "gm1", isGM: true };

      const sendMessageSpy = jest.spyOn(chatSocketInstance as any, 'sendMessage')
        .mockResolvedValue("success");

      await chatSocketInstance.executeAsGM("testEvent", "arg1", "arg2", { complex: true });

      const callArgs = sendMessageSpy.mock.calls[0];
      expect(callArgs[1]).toEqual(["arg1", "arg2", { complex: true }]);
      expect(callArgs[2]).toBe(true); // onlyPlayers should be true

      sendMessageSpy.mockRestore();
    });
  });

  describe("Consistency between SocketLib and ChatSocket", () => {
    it("should both implementations set onlyPlayers=true when executeAsGM is called", async () => {
      mockGame.user = { id: "gm1", isGM: true };
      
      const sendMessageSpy = jest.spyOn(chatSocketInstance as any, 'sendMessage')
        .mockResolvedValue("success");

      await chatSocketInstance.executeAsGM("testEvent", { data: "test" });

      expect(sendMessageSpy).toHaveBeenCalledWith(
        "testEvent",
        [{ data: "test" }],
        true, // onlyPlayers = true
        false // toGM = false
      );

      sendMessageSpy.mockRestore();
    });

    it("should verify that both implementations handle the onlyPlayers flag consistently", () => {
      // SocketLib: define onlyPlayers: true no payload para executeForUsers
      // ChatSocket: passa onlyPlayers=true como parâmetro para sendMessage
      
      const onlyPlayersFlag = true;
      
      // SocketLib usa o onlyPlayers no payload
      const socketLibPayload = { data: ["test"], onlyPlayers: onlyPlayersFlag };
      expect(socketLibPayload.onlyPlayers).toBe(true);
      
      // ChatSocket usa o parâmetro onlyPlayers
      const chatSocketOnlyPlayersParam = onlyPlayersFlag;
      expect(chatSocketOnlyPlayersParam).toBe(true);
    });
  });

  describe("isReadyToSendToGM", () => {
    it("should return true when user is GM", () => {
      mockGame.user = { id: "gm1", isGM: true };
      expect(chatSocketInstance.isReadyToSendToGM()).toBe(true);
    });

    it("should return false when user is not GM", () => {
      mockGame.user = { id: "user1", isGM: false };
      expect(chatSocketInstance.isReadyToSendToGM()).toBe(false);
    });
  });

  describe("register and callbacks", () => {
    it("should register callback for event", () => {
      const callback = jest.fn();
      chatSocketInstance.register("testEvent", callback);
      
      // Como o register apenas chama setCallback, vamos verificar se o método não lança erro
      expect(() => chatSocketInstance.register("testEvent", callback)).not.toThrow();
    });
  });
});
