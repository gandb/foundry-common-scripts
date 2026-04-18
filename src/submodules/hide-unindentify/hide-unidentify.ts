import { Log, injectController } from "taulukko-commons";
import { SubModuleBase } from "../sub-module-base";
import type { IGameContext } from "../../common/igame-context";

export class HideUnidentify extends SubModuleBase {
  readonly #requiredHooksLoaded: boolean = true;

  protected async waitReady() {
    if (!this.#requiredHooksLoaded) {
      throw new Error(
        "This module is created ready, no need to wait for hooks",
      );
    }
    Hooks.callAll("onReadyHideUnidentify", {});
  }

  protected async initHooks() {
    Hooks.on(
      "renderItemSheet5e",
      (sheet: any | undefined, options: any | undefined) => {
        const logguer: Log = injectController.resolve("CommonLogguer");
        const hideUnidentify: HideUnidentify =
          injectController.resolve("HideUnidentify");
        logguer.debug("dnd5e.renderItemSheet5e called");
        hideUnidentify.removeItemSheetIdentifyInformations(sheet, options);
      },
    );

    Hooks.on("dnd5e.getItemContextOptions", (item, buttons) => {
      const logguer: Log = injectController.resolve("CommonLogguer");
      const hideUnidentify: HideUnidentify =
        injectController.resolve("HideUnidentify");
      logguer.debug("dnd5e.getItemContextOptions called");
      hideUnidentify.removeButtonsFromItemContext(item, buttons as any[]);
    });
  }

  removeButtonsFromItemContext(item: any, buttons: Array<any>) {
    const gameContext: IGameContext = injectController.resolve(
      "GameContext",
    ) as IGameContext;
    const logguer: Log = injectController.resolve("CommonLogguer");
    logguer.debug("removeButtonsFromItemContext called");
    if (gameContext.user?.isGM) {
      logguer.debug(
        "is GM - not removing Identify button from Item Sheet context menu",
      );
      return;
    }
    const identified = item.system.identified;
    if (identified) {
      logguer.debug(
        "Item:",
        item.name,
        " - Item is identified - not removing Identify button from Item Sheet context menu",
      );
      return;
    }

    const needRemoveButtons = [
      "DND5E.Identify",
      "DND5E.ContextMenuActionAttune",
    ];

    needRemoveButtons.forEach((buttonName) => {
      const index = buttons.findIndex((option) => option.name === buttonName);
      if (index !== -1) {
        logguer.debug(
          "Item:",
          item.name,
          " - Removing",
          buttonName,
          "button from Item Sheet context menu at index",
          index,
        );
        buttons.splice(index, 1);
      }
    });
  }

  removeItemSheetIdentifyInformations(sheet: any, option: any | undefined) {
    const gameContext: IGameContext = injectController.resolve(
      "GameContext",
    ) as IGameContext;
    const logguer: Log = injectController.resolve("CommonLogguer");
    logguer.debug("removeButtonsFromItemContext called");

    if (gameContext.user?.isGM) {
      logguer.debug(
        "is GM - not removing Identify button from Item Sheet context menu",
      );
      return;
    }

    const identified = sheet.item.system.identified;
    if (identified) {
      return;
    }

    document
      .querySelectorAll(
        ".dnd5e.sheet.item .sheet-header .item-subtitle label:has(input:not([disabled]))",
      )
      .forEach((n) => n.remove());
    document.querySelectorAll(".toggle-identified").forEach((n) => n.remove());
  }
}
