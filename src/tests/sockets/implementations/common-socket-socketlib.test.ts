/// <reference types="jest" />
/// <reference path="../../../../types/test-globals.d.ts" />

import { SocketLib } from "../../../../src/sockets/implementations/common-socket-socketlib";

/**
 * Mock global Foundry objects
 */
const mockGame: any = {
  users: new Map(),
  user: { id: "gm1", isGM: true },
};

const mockSocketLib: any = {
  registerModule: jest.fn(),
  executeForEveryone: jest.fn(),
  executeForUsers: jest.fn(),
  executeAsGM: jest.fn(),
  executeForOtherGMs: jest.fn(),
  executeForOthers: jest.fn(),
  register: jest.fn(),
};

(global as any).game = mockGame;
(global as any).socketlib = { registerModule: jest.fn(() => mockSocketLib) };
(global as any).Hooks = {
  once: jest.fn(),
  callAll: jest.fn(),
};

// Mock injectController
jest.mock("taulukko-commons", () => ({
  Log: jest.fn(),
  injectController: {
    resolve: jest.fn(),
  },
}));

jest.mock("../../../../src/common-module", () => ({
  CommonModule: jest.fn(),
}));

describe("SocketLib executeAsGM", () => {
  let socketLib: SocketLib;

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup mock injectController resolves
    const { injectController } = require("taulukko-commons");
    injectController.resolve.mockImplementation((name: string) => {
      if (name === "CommonLogguer") {
        return { debug: jest.fn(), error: jest.fn() };
      }
      if (name === "CommonModule") {
        return { name: "test-module" };
      }
      if (name === "Socket") {
        return socketLib;
      }
      return null;
    });
    // Mock game.modules.get
    mockGame.modules = {
      get: jest.fn(() => ({ active: true })),
    };
    socketLib = new SocketLib();
  });

  it("should send messages only to non-GM users when executeAsGM is called by GM", async () => {
    // Setup mock users: 1 GM, 2 players
    const gmUser = { id: "gm1", isGM: true };
    const player1 = { id: "p1", isGM: false };
    const player2 = { id: "p2", isGM: false };
    mockGame.users = new Map([
      ["gm1", gmUser],
      ["p1", player1],
      ["p2", player2],
    ]);
    mockGame.user = gmUser;

    // Mock socketlib.registerModule returns mock socket
    const socketInstance = {
      executeForUsers: jest.fn(() => Promise.resolve()),
    };
    global.socketlib.registerModule.mockReturnValue(socketInstance);

    // Initialize socket (call waitReady maybe)
    // We'll need to trigger hooks, but for simplicity, we'll manually set _socketOriginal
    socketLib["_socketOriginal"] = socketInstance;

    // Call executeAsGM
    await socketLib.executeAsGM("testEvent", "arg1", "arg2");

    // Verify executeForUsers was called with list of player IDs (non-GM)
    expect(socketInstance.executeForUsers).toHaveBeenCalledTimes(1);
    const result:any =
      socketInstance.executeForUsers.mock.calls[0];
    const eventName = result[0];
    const recipients = result[1];
    const data =  result[2];
    expect(eventName).toBe("testEvent");
    expect(recipients).toEqual(["p1", "p2"]); // only non-GM users
    // Should include onlyPlayers flag in data
    expect(data[0]).toEqual({ data: ["arg1", "arg2"], onlyPlayers: true });
  });

  it("should not send messages to GM when onlyPlayers flag is set and receiver is GM", async () => {
    // This test will be for register method filtering
    // Setup mock users: GM as receiver
    mockGame.user = { id: "gm1", isGM: true };

    const socketInstance = {
      register: jest.fn(),
    };
    socketLib["_socketOriginal"] = socketInstance;

    // Register a callback
    const callback = jest.fn();
    await socketLib.register("testEvent", callback);

    // The registered wrapper should filter out GM when onlyPlayers flag present
    // We need to examine the wrapper registered with socketlib
    expect(socketInstance.register).toHaveBeenCalled();
    const registeredHandler = socketInstance.register.mock.calls[0][1];

    // Simulate receiving data with onlyPlayers flag
    const dataWithFlag = [{ data: ["arg1"], onlyPlayers: true }];
    registeredHandler(...dataWithFlag);

    // Callback should NOT be called because receiver is GM
    expect(callback).not.toHaveBeenCalled();
  });

  it("should deliver messages to non-GM users when onlyPlayers flag is set", async () => {
    mockGame.user = { id: "p1", isGM: false };

    const socketInstance = {
      register: jest.fn(),
    };
    socketLib["_socketOriginal"] = socketInstance;

    const callback = jest.fn(() => "result");
    await socketLib.register("testEvent", callback);

    const registeredHandler = socketInstance.register.mock.calls[0][1];
    const dataWithFlag = [{ data: ["arg1"], onlyPlayers: true }];
    const result = await registeredHandler(...dataWithFlag);

    // Callback should be called because receiver is not GM
    expect(callback).toHaveBeenCalledWith("arg1");
    expect(result).toBe("result");
  });
});
