/// <reference types="jest" />
/// <reference path="../../../../types/test-globals.d.ts" />

import { SocketLib } from "../../../../src/sockets/implementations/common-socket-socketlib";

const mockGame: any = {
  users: new Map(),
  user: { id: "gm1", isGM: true },
  modules: new Map([["common-scripts-dnd5ed", { active: true }]]),
};

const mockSocketLib: any = {
  registerModule: jest.fn(() => ({
    executeForEveryone: jest.fn(),
    executeForUsers: jest.fn(),
    executeAsGM: jest.fn(),
    executeForOtherGMs: jest.fn(),
    executeForOthers: jest.fn(),
    register: jest.fn(),
  })),
  executeForEveryone: jest.fn(),
  executeForUsers: jest.fn(),
  executeAsGM: jest.fn(),
  executeForOtherGMs: jest.fn(),
  executeForOthers: jest.fn(),
  register: jest.fn(),
};

jest.mock("taulukko-commons", () => ({
  Log: jest.fn(),
  injectController: {
    resolve: jest.fn((name: string) => {
      if (name === "GameContext") return mockGame;
      if (name === "CommonLogguer") return { debug: jest.fn() };
      if (name === "CommonModule") return { name: "common-scripts-dnd5ed" };
      if (name === "Socket") return new SocketLib();
      return null;
    }),
  },
}));

jest.mock("../../../../src/common-module", () => ({
  CommonModule: jest.fn(),
}));

describe("SocketLib executeAsGM", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGame.modules = {
      get: jest.fn((name: string) => ({ active: true })),
    };
  });

  it("should throw if user is not GM", async () => {
    const { injectController } = require("taulukko-commons");
    injectController.resolve.mockImplementation((name: string) => {
      if (name === "GameContext")
        return { user: { isGM: false }, users: new Map() };
      if (name === "CommonLogguer") return { debug: jest.fn() };
      return null;
    });

    const socketLib = new SocketLib();
    await expect(socketLib.executeAsGM("testEvent")).rejects.toThrow();
  });

  it.skip("should send to non-GM users only", async () => {
    mockGame.users = new Map([
      ["user1", { id: "user1", isGM: false }],
      ["gm1", { id: "gm1", isGM: true }],
    ]);

    const { injectController } = require("taulukko-commons");
    injectController.resolve.mockImplementation((name: string) => {
      if (name === "GameContext") return mockGame;
      if (name === "CommonLogguer") return { debug: jest.fn() };
      return null;
    });

    const socketLib = new SocketLib();

    await socketLib.executeAsGM("testEvent", { data: "test" });
  });
});
