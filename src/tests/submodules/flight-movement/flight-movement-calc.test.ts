import {
  calcHypotenuse,
  calcCathetus,
} from "../../../submodules/flight-movement/flight-movement-calc";

describe("calcHypotenuse", () => {
  it("should compute the hypotenuse of a 3-4-5 triangle", () => {
    expect(calcHypotenuse(3, 4)).toBe(5);
  });

  it("should compute the hypotenuse of a 5-12-13 triangle", () => {
    expect(calcHypotenuse(5, 12)).toBe(13);
  });

  it("should return its own value when the other leg is 0", () => {
    expect(calcHypotenuse(10, 0)).toBe(10);
    expect(calcHypotenuse(0, 7)).toBe(7);
  });

  it("should return 0 when both legs are 0", () => {
    expect(calcHypotenuse(0, 0)).toBe(0);
  });

  it("should round to 2 decimal places", () => {
    // sqrt(1² + 1²) = sqrt(2) ≈ 1.4142...
    expect(calcHypotenuse(1, 1)).toBe(1.41);
  });

  it("should return 0 for negative X values", () => {
    expect(calcHypotenuse(-3, 4)).toBe(0);
  });

  it("should return 0 for negative Y values", () => {
    expect(calcHypotenuse(3, -4)).toBe(0);
  });

  it("should return 0 when both are negative", () => {
    expect(calcHypotenuse(-3, -4)).toBe(0);
  });

  it("should work with decimal values", () => {
    // sqrt(1.5² + 2.5²) = sqrt(2.25 + 6.25) = sqrt(8.5) ≈ 2.9154...
    expect(calcHypotenuse(1.5, 2.5)).toBe(2.92);
  });

  it("should work with large values (D&D feet movement)", () => {
    // 30 feet horizontal and 40 feet vertical flight
    expect(calcHypotenuse(30, 40)).toBe(50);
  });
});

describe("calcCathetus", () => {
  it("should compute the leg of a 3-4-5 triangle (given hypotenuse and one leg)", () => {
    expect(calcCathetus(5, 3)).toBe(4);
    expect(calcCathetus(5, 4)).toBe(3);
  });

  it("should compute the leg of a 5-12-13 triangle", () => {
    expect(calcCathetus(13, 5)).toBe(12);
    expect(calcCathetus(13, 12)).toBe(5);
  });

  it("should return 0 when the hypotenuse equals the other leg", () => {
    expect(calcCathetus(5, 5)).toBe(0);
  });

  it("should return the hypotenuse value when the other leg is 0", () => {
    expect(calcCathetus(10, 0)).toBe(10);
  });

  it("should return 0 when the hypotenuse is smaller than the leg (impossible triangle)", () => {
    expect(calcCathetus(3, 5)).toBe(0);
  });

  it("should return 0 for negative hypotenuse", () => {
    expect(calcCathetus(-5, 3)).toBe(0);
  });

  it("should return 0 for negative leg", () => {
    expect(calcCathetus(5, -3)).toBe(0);
  });

  it("should round to 2 decimal places", () => {
    // sqrt(10² - 7²) = sqrt(100 - 49) = sqrt(51) ≈ 7.1414...
    expect(calcCathetus(10, 7)).toBe(7.14);
  });

  it("should work with decimal values", () => {
    // sqrt(5² - 2.5²) = sqrt(25 - 6.25) = sqrt(18.75) ≈ 4.3301...
    expect(calcCathetus(5, 2.5)).toBe(4.33);
  });

  it("should return 0 when both are 0", () => {
    expect(calcCathetus(0, 0)).toBe(0);
  });
});
