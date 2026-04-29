/// <reference types="jest" />
/// <reference path="../../../../types/test-globals.d.ts" />

import { SocketLib } from "../../../../src/sockets/implementations/common-socket-socketlib";

const mockGame: any = {
  users: new Map(),
  user: { id: "gm1", isGM: true },
  modules: new Map([["common-scripts-dnd5ed", { active: true }]]),
};

// Instância compartilhada para os testes
let socketLibInstance: SocketLib;
let mockExecuteForUsers: jest.Mock;

jest.mock("taulukko-commons", () => ({
  Log: jest.fn(),
  injectController: {
    resolve: jest.fn((name: string) => {
      if (name === "GameContext") return mockGame;
      if (name === "CommonLogguer") return { debug: jest.fn() };
      if (name === "CommonModule") return { name: "common-scripts-dnd5ed" };
      if (name === "Socket") return socketLibInstance;
      return null;
    }),
  },
}));

jest.mock("../../../../src/common-module", () => ({
  CommonModule: jest.fn(),
}));

describe("SocketLib", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGame.modules = {
      get: jest.fn((name: string) => ({ active: true })),
    };
    mockGame.user = { id: "gm1", isGM: true };
    
    // Criar nova instância para cada teste
    socketLibInstance = new SocketLib();
    
    // Mock do socketOriginal para verificar chamadas
    mockExecuteForUsers = jest.fn().mockResolvedValue("success");
    (socketLibInstance as any)._socketOriginal = {
      executeForEveryone: jest.fn(),
      executeForUsers: mockExecuteForUsers,
      executeAsGM: jest.fn(),
      executeForOtherGMs: jest.fn(),
      executeForOthers: jest.fn(),
      register: jest.fn(),
    };
  });

  describe("getNonGMUserIds", () => {
    it("should return empty array when users is not available", () => {
      mockGame.users = undefined;
      const result = (socketLibInstance as any).getNonGMUserIds();
      expect(result).toEqual([]);
    });

    it("should return only non-GM user IDs", () => {
      mockGame.users = new Map([
        ["user1", { id: "user1", isGM: false }],
        ["user2", { id: "user2", isGM: false }],
        ["gm1", { id: "gm1", isGM: true }],
        ["gm2", { id: "gm2", isGM: true }],
      ]);

      const result = (socketLibInstance as any).getNonGMUserIds();
      expect(result).toEqual(["user1", "user2"]);
    });

    it("should return empty array when all users are GM", () => {
      mockGame.users = new Map([
        ["gm1", { id: "gm1", isGM: true }],
        ["gm2", { id: "gm2", isGM: true }],
      ]);

      const result = (socketLibInstance as any).getNonGMUserIds();
      expect(result).toEqual([]);
    });
  });

  describe("executeAsGM", () => {
    it("should throw if user is not GM", async () => {
      mockGame.user = { id: "user1", isGM: false };
      
      await expect(socketLibInstance.executeAsGM("testEvent")).rejects.toThrow(
        "Isnt ready to send to gm or you isnt GM"
      );
    });

    it("should throw if gameContext.user is not available", async () => {
      mockGame.user = null;
      
      await expect(socketLibInstance.executeAsGM("testEvent")).rejects.toThrow(
        "Isnt ready to send to gm or you isnt GM"
      );
    });

    it("should throw if gameContext.users is not available", async () => {
      mockGame.users = null;
      
      await expect(socketLibInstance.executeAsGM("testEvent")).rejects.toThrow(
        "Isnt ready to send to gm or you isnt GM"
      );
    });

    it("should not call executeForUsers if there are no non-GM users", async () => {
      mockGame.users = new Map([
        ["gm1", { id: "gm1", isGM: true }],
      ]);

      const result = await socketLibInstance.executeAsGM("testEvent", { data: "test" });
      
      expect(mockExecuteForUsers).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it("should send to non-GM users only", async () => {
      mockGame.users = new Map([
        ["user1", { id: "user1", isGM: false }],
        ["user2", { id: "user2", isGM: false }],
        ["gm1", { id: "gm1", isGM: true }],
      ]);

      const testData = { data: "test", value: 123 };
      const result = await socketLibInstance.executeAsGM("testEvent", testData);

      expect(mockExecuteForUsers).toHaveBeenCalledTimes(1);
      expect(mockExecuteForUsers).toHaveBeenCalledWith(
        "testEvent",
        ["user1", "user2"], // apenas non-GM users
        { data: [testData], onlyPlayers: true }
      );
      expect(result).toBe("success");
    });

    it("should send to non-GM users with onlyPlayers flag set to true", async () => {
      mockGame.users = new Map([
        ["user1", { id: "user1", isGM: false }],
        ["gm1", { id: "gm1", isGM: true }],
      ]);

      await socketLibInstance.executeAsGM("anotherEvent", { action: "doSomething" });

      const callArgs = mockExecuteForUsers.mock.calls[0];
      expect(callArgs[2]).toHaveProperty("onlyPlayers", true);
      expect(callArgs[2]).toHaveProperty("data");
      expect(Array.isArray(callArgs[2].data)).toBe(true);
    });

    it("should handle multiple data arguments correctly", async () => {
      mockGame.users = new Map([
        ["user1", { id: "user1", isGM: false }],
      ]);

      await socketLibInstance.executeAsGM("testEvent", "arg1", "arg2", { complex: true });

      const callArgs = mockExecuteForUsers.mock.calls[0];
      expect(callArgs[2].data).toEqual(["arg1", "arg2", { complex: true }]);
    });

    it("should return the promise from executeForUsers", async () => {
      mockGame.users = new Map([
        ["user1", { id: "user1", isGM: false }],
      ]);
      
      const expectedReturn = { success: true, message: "sent" };
      mockExecuteForUsers.mockResolvedValueOnce(expectedReturn);

      const result = await socketLibInstance.executeAsGM("testEvent", { data: "test" });
      
      expect(result).toEqual(expectedReturn);
    });
  });
});
