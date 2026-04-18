/// <reference types="jest" />
import { SocketLib } from "../../../../src/sockets/implementations/common-socket-socketlib";
import { injectController } from "taulukko-commons";

jest.mock("taulukko-commons", () => ({
  injectController: {
    resolve: jest.fn(),
  },
}));

describe("SocketLib Context Stability", () => {
  let socketLibInstance: SocketLib;

  beforeEach(() => {
    jest.clearAllMocks();

    socketLibInstance = new SocketLib();

    // Mock do socket original interno
    (socketLibInstance as any)._socketOriginal = {
      executeForEveryone: jest.fn().mockResolvedValue("success"),
      executeForUsers: jest.fn().mockResolvedValue("success"),
      register: jest.fn(),
    };

    // Mock do injectController para agir como um Singleton real
    (injectController.resolve as jest.Mock).mockImplementation(
      (name: string) => {
        if (name === "Socket") return socketLibInstance;
        if (name === "GameContext")
          return {
            users: new Map(),
            user: { isGM: true },
            modules: new Map([["common-scripts-dnd5ed", { active: true }]]),
          };
        if (name === "CommonLogguer") return { debug: jest.fn() };
        if (name === "CommonModule") return { name: "common-scripts-dnd5ed" };
        return null;
      },
    );
  });

  it("should NOT throw when executeForAll is called detached", async () => {
    const detached = socketLibInstance.executeForAll;
    await expect(detached("testEvent", "someData")).resolves.not.toThrow();
  });

  it("should NOT throw when executeAsGM is called detached", async () => {
    const detached = socketLibInstance.executeAsGM;
    await expect(detached("testEvent", "someData")).resolves.not.toThrow();
  });

  it("should NOT throw when executeToGM is called detached", async () => {
    const detached = socketLibInstance.executeToGM;
    await expect(detached("testEvent", "someData")).resolves.not.toThrow();
  });

  it("should NOT throw when executeIn is called detached", async () => {
    const detached = socketLibInstance.executeIn;
    await expect(
      detached("testEvent", ["user1"], "someData"),
    ).resolves.not.toThrow();
  });

  it("should NOT throw when register is called detached", async () => {
    const detached = socketLibInstance.register;
    await expect(detached("testEvent", () => {})).resolves.not.toThrow();
  });
});
