import { Log, injectController } from "taulukko-commons";
import { Button } from "../npc/button";
import { SubModuleBase } from "../sub-module-base";
import { NPC } from "../npc/npc";

var dialogUtils: DialogUtils | undefined = undefined;

// Estilos compartilhados dos dialogos (taulukko-dialog.css). Injetados em runtime
// UMA vez por sessao: garante o visual mesmo com o manifesto do modulo em cache
// no servidor Foundry (o module.json so relista os styles apos restart).
const DIALOG_STYLE_ID = "taulukko-dialog-style";
const DIALOG_STYLE_HREF =
  "modules/common-scripts-dnd5ed/scripts/styles/taulukko-dialog.css";
function ensureDialogStyle(): void {
  try {
    if (document.getElementById(DIALOG_STYLE_ID)) {
      return;
    }
    const style = document.createElement("style");
    style.id = DIALOG_STYLE_ID;
    document.head.appendChild(style);
    // R10: HTTP cache bypass — the CSS changes in dev and must arrive fresh
    // (Foundry module URLs have no cache-buster).
    fetch(DIALOG_STYLE_HREF + "?t=" + Date.now(), { cache: "reload" })
      .then((r) => (r.ok ? r.text() : ""))
      .then((css) => {
        if (css) {
          style.textContent = css;
        }
      })
      .catch(() => {});
  } catch (e) {}
}

export class DialogUtils extends SubModuleBase {
  public readonly npctype = NPC;

  #requiredHooksLoaded: boolean = false;

  constructor() {
    super();
    dialogUtils = this;
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

    Hooks.callAll("onReadyDialogUtils", {});
    logguer.debug("Dialog Utils ready");
  }

  protected async initHooks() {
    if (injectController.has("DialogUtils")) {
      dialogUtils = injectController.resolve("DialogUtils") as DialogUtils;
    }
    (dialogUtils as DialogUtils).#requiredHooksLoaded = true;
  }

  public createButton(
    action: string,
    label: string,
    defaultValue: boolean = false,
    type: string = "screen",
    callback: any = undefined,
  ): Button {
    const button: Button = new Button(
      action,
      label,
      defaultValue,
      type,
      callback,
    );

    return button;
  }

  public createDialog(
    title: string,
    style: string = "",
    content: string = "",
    buttons: Array<any> = new Array(),
    submit: (...args: any[]) => void = () => {},
    left: undefined | number = undefined,
    top: undefined | number = undefined,
    width: number | "auto" = "auto",
    height: number | "auto" = "auto",
  ): foundry.applications.api.DialogV2 {
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
    logguer.debug(
      "Dialog Utils creating dialog width: ",
      width,
      " height: ",
      height,
    );
    if (!buttons?.length || buttons.length === 0) {
      throw new Error(
        "DialogUtils.createDialog: buttons array must have at least one button",
      );
    }

    ensureDialogStyle();

    const options = {
      window: { title, resizable: true },
      classes: ["taulukko-dialog"],
      content: `<style>${style}</style>	
					<div>${content}</div>`,
      buttons,
      submit: submit,
      position: { width: width, height, left, top },
    };

    logguer.debug("Dialog Utils dialog options: ", options);
    const ret = new foundry.applications.api.DialogV2(options);
    try {
      // R10: stores the render promise — callers may wait for the new window
      // to paint before closing the old one.
      (ret as any)._renderPromise = ret.render({ force: true });
    } catch (e) {
      ret.render({ force: true });
    }
    return ret;
  }
}
