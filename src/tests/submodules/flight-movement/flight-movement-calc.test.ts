import {
  calcHypotenuse,
  calcCathetus,
} from "../../../submodules/flight-movement/flight-movement-calc";

describe("calcHypotenuse", () => {
  it("deve calcular a hipotenusa de um triângulo 3-4-5", () => {
    expect(calcHypotenuse(3, 4)).toBe(5);
  });

  it("deve calcular a hipotenusa de um triângulo 5-12-13", () => {
    expect(calcHypotenuse(5, 12)).toBe(13);
  });

  it("deve retornar o próprio valor quando o outro cateto é 0", () => {
    expect(calcHypotenuse(10, 0)).toBe(10);
    expect(calcHypotenuse(0, 7)).toBe(7);
  });

  it("deve retornar 0 quando ambos os catetos são 0", () => {
    expect(calcHypotenuse(0, 0)).toBe(0);
  });

  it("deve arredondar a 2 casas decimais", () => {
    // sqrt(1² + 1²) = sqrt(2) ≈ 1.4142...
    expect(calcHypotenuse(1, 1)).toBe(1.41);
  });

  it("deve retornar 0 para valores negativos de X", () => {
    expect(calcHypotenuse(-3, 4)).toBe(0);
  });

  it("deve retornar 0 para valores negativos de Y", () => {
    expect(calcHypotenuse(3, -4)).toBe(0);
  });

  it("deve retornar 0 para ambos negativos", () => {
    expect(calcHypotenuse(-3, -4)).toBe(0);
  });

  it("deve funcionar com valores decimais", () => {
    // sqrt(1.5² + 2.5²) = sqrt(2.25 + 6.25) = sqrt(8.5) ≈ 2.9154...
    expect(calcHypotenuse(1.5, 2.5)).toBe(2.92);
  });

  it("deve funcionar com valores grandes (movimento em feet D&D)", () => {
    // Voo de 30 feet horizontal e 40 feet vertical
    expect(calcHypotenuse(30, 40)).toBe(50);
  });
});

describe("calcCathetus", () => {
  it("deve calcular o cateto de um triângulo 3-4-5 (dado hipotenusa e um cateto)", () => {
    expect(calcCathetus(5, 3)).toBe(4);
    expect(calcCathetus(5, 4)).toBe(3);
  });

  it("deve calcular o cateto de um triângulo 5-12-13", () => {
    expect(calcCathetus(13, 5)).toBe(12);
    expect(calcCathetus(13, 12)).toBe(5);
  });

  it("deve retornar 0 quando a hipotenusa é igual ao outro cateto", () => {
    expect(calcCathetus(5, 5)).toBe(0);
  });

  it("deve retornar o valor da hipotenusa quando o outro cateto é 0", () => {
    expect(calcCathetus(10, 0)).toBe(10);
  });

  it("deve retornar 0 quando a hipotenusa é menor que o cateto (triângulo impossível)", () => {
    expect(calcCathetus(3, 5)).toBe(0);
  });

  it("deve retornar 0 para hipotenusa negativa", () => {
    expect(calcCathetus(-5, 3)).toBe(0);
  });

  it("deve retornar 0 para cateto negativo", () => {
    expect(calcCathetus(5, -3)).toBe(0);
  });

  it("deve arredondar a 2 casas decimais", () => {
    // sqrt(10² - 7²) = sqrt(100 - 49) = sqrt(51) ≈ 7.1414...
    expect(calcCathetus(10, 7)).toBe(7.14);
  });

  it("deve funcionar com valores decimais", () => {
    // sqrt(5² - 2.5²) = sqrt(25 - 6.25) = sqrt(18.75) ≈ 4.3301...
    expect(calcCathetus(5, 2.5)).toBe(4.33);
  });

  it("deve retornar 0 quando ambos são 0", () => {
    expect(calcCathetus(0, 0)).toBe(0);
  });
});
