import { Log, injectController } from "taulukko-commons";
import { SubModuleBase } from "../sub-module-base";
import { DialogUtils } from "../dialog-utils/dialog-utils";
import { calcHypotenuse, calcCathetus } from "./flight-movement-calc";

/**
 * Submodule FlightMovement - Calculadora de Movimento em Voo (D&D 5e).
 *
 * Adiciona um botão em Token Controls que abre um formulário com 3 campos:
 * - Eixo X (movimento horizontal)
 * - Eixo Y (movimento vertical)
 * - Hipotenusa (movimento total)
 *
 * O usuário preenche 2 dos 3 campos e o terceiro é calculado
 * automaticamente pelo Teorema de Pitágoras.
 */

let flightMovement: FlightMovement | undefined = undefined;

export class FlightMovement extends SubModuleBase {

  #requiredHooksLoaded: boolean = false;

  constructor() {
    super();
    flightMovement = this;
  }

  protected async initHooks() {
    Hooks.on("getSceneControlButtons", async (controls: any) => {
      const logguer: Log = injectController.resolve("CommonLogguer");
      flightMovement = (
        injectController.has("FlightMovement")
          ? injectController.resolve("FlightMovement")
          : flightMovement
      ) as FlightMovement;

      await flightMovement.addFlightButton(controls);

      logguer.debug("FlightMovement: getSceneControlButtons hook processed");
    });
  }

  protected async waitReady() {
    const flightMovementInstance: FlightMovement = (
      injectController.has("FlightMovement")
        ? injectController.resolve("FlightMovement")
        : flightMovement
    ) as FlightMovement;
    flightMovementInstance.#requiredHooksLoaded = true;
  }

  public async addFlightButton(controls: any) {
    const logguer: Log = injectController.resolve("CommonLogguer");
    const flightMovementInstance: FlightMovement = (
      injectController.has("FlightMovement")
        ? injectController.resolve("FlightMovement")
        : flightMovement
    ) as FlightMovement;

    logguer.debug("FlightMovement: Criando botão de cálculo de voo", controls);

    controls.tokens.tools["flightMovementButton"] = {
      name: "flightMovementButton",
      title: "Calculadora de Voo",
      icon: "fa-solid fa-dove",
      button: true,
      toggle: false,
      onClick: () => {
        logguer.debug("FlightMovement: Botão de voo pressionado");
        flightMovementInstance.showFlightDialog();
      },
    };

    logguer.debug("FlightMovement: Botão de voo criado");
  }

  public async showFlightDialog() {
    const logguer: Log = injectController.resolve("CommonLogguer");
    const flightMovementInstance: FlightMovement = (
      injectController.has("FlightMovement")
        ? injectController.resolve("FlightMovement")
        : flightMovement
    ) as FlightMovement;

    const fiveMinutes: number = 5 * 60 * 1000;
    await flightMovementInstance.whaitFor(
      () => injectController.has("DialogUtils"),
      fiveMinutes,
    );

    if (!injectController.has("DialogUtils")) {
      throw new Error("FlightMovement: Timeout waiting for DialogUtils inject");
    }

    const dialogUtils: DialogUtils = injectController.resolve("DialogUtils");

    logguer.debug("FlightMovement: Abrindo diálogo de cálculo de voo");

    const title = "Calculadora de Movimento em Voo";

    const style = `
			.flight-calc { padding: 15px; background: #222; color: #eee; }
			.flight-calc label { display: block; margin-top: 8px; font-weight: bold; }
			.flight-calc input {
				width: 100%; padding: 4px; margin-top: 2px;
				background: #333; color: #eee; border: 1px solid #555;
				box-sizing: border-box;
			}
			.flight-calc .flight-result { color: #5fa85f; font-weight: bold; }
			.flight-calc .flight-error { color: #cc4444; font-size: 0.9em; margin-top: 4px; }
		`;

    const content = `
			<div class="flight-calc">
				<p>Preencha 2 dos 3 campos, sugiro sempre preencher o campo 3 já que ele que define quanto seu persoangem vai se mover. O terceiro campo não preenchido será calculado automaticamente.</p>
				<label for="flight-x">1- Quanto você quer andar de fato no mapa em feet (eixo x)?:</label>
				<input type="number" id="flight-x" min="0" step="0.01" placeholder="0" />
				<label for="flight-y">2- Quanto você pretende descer ou subir de altura em feet (eixo y):</label>
				<input type="number" id="flight-y" min="0" step="0.01" placeholder="0" />
				<label for="flight-hyp">3- Qual vai ser o movimento total do seu personagem em feet (ex: 30 )? </label>
				<input type="number" id="flight-hyp" min="0" step="0.01" placeholder="0" />
				<div id="flight-error" class="flight-error"></div>
				<button id="flight-calc-btn" type="button" style="margin-top: 10px; padding: 6px 16px; font-weight: bold; cursor: pointer;">Calcular</button>
			</div>
		`;

    const closeButton = dialogUtils.createButton(
      "close",
      "Fechar",
      true,
      "screen",
    );

    dialogUtils.createDialog(
      title,
      style,
      content,
      [closeButton],
      undefined,
      undefined,
      undefined,
      400,
    );

    logguer.debug("FlightMovement: Diálogo criado");

    const attachCalcListener = () => {
      const calcBtn = document.getElementById("flight-calc-btn");
      if (!calcBtn) {
        requestAnimationFrame(attachCalcListener);
        return;
      }

      calcBtn.addEventListener("click", () => {
        const inputX = document.getElementById("flight-x") as HTMLInputElement;
        const inputY = document.getElementById("flight-y") as HTMLInputElement;
        const inputHyp = document.getElementById(
          "flight-hyp",
        ) as HTMLInputElement;
        const errorDiv = document.getElementById(
          "flight-error",
        ) as HTMLDivElement;

        if (!inputX || !inputY || !inputHyp) {
          return;
        }

        const xVal = inputX.value.trim();
        const yVal = inputY.value.trim();
        const hypVal = inputHyp.value.trim();

        errorDiv.textContent = "";

        const filledFields: string[] = [];
        if (xVal !== "") filledFields.push("x");
        if (yVal !== "") filledFields.push("y");
        if (hypVal !== "") filledFields.push("hyp");

        if (filledFields.length < 2) {
          errorDiv.textContent = "Preencha pelo menos 2 campos para calcular.";
          return;
        }

        const x = parseFloat(xVal) || 0;
        const y = parseFloat(yVal) || 0;
        const hyp = parseFloat(hypVal) || 0;

        if (x < 0 || y < 0 || hyp < 0) {
          errorDiv.textContent = "Todos os valores devem ser >= 0.";
          return;
        }

        if (filledFields.includes("x") && filledFields.includes("y")) {
          const result = calcHypotenuse(x, y);
          inputHyp.value = String(result);
          inputHyp.classList.add("flight-result");
          inputX.classList.remove("flight-result");
          inputY.classList.remove("flight-result");
        } else if (filledFields.includes("x") && filledFields.includes("hyp")) {
          if (hyp < x) {
            errorDiv.textContent =
              "O movimento não pode ser menor que o Eixo X.";
            return;
          }
          const result = calcCathetus(hyp, x);
          inputY.value = String(result);
          inputY.classList.add("flight-result");
          inputX.classList.remove("flight-result");
          inputHyp.classList.remove("flight-result");
        } else if (filledFields.includes("y") && filledFields.includes("hyp")) {
          if (hyp < y) {
            errorDiv.textContent =
              "O movimento não pode ser menor que o Eixo Y.";
            return;
          }
          const result = calcCathetus(hyp, y);
          inputX.value = String(result);
          inputX.classList.add("flight-result");
          inputY.classList.remove("flight-result");
          inputHyp.classList.remove("flight-result");
        }

        logguer.debug("FlightMovement: Cálculo realizado", {
          x: inputX.value,
          y: inputY.value,
          hyp: inputHyp.value,
        });
      });

      logguer.debug(
        "FlightMovement: Event listener do botão Calcular atachado",
      );
    };

    requestAnimationFrame(attachCalcListener);
  }
}
