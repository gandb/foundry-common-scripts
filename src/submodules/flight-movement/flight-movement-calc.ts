/**
 * Funções puras de cálculo de movimento em voo baseadas no Teorema de Pitágoras.
 *
 * No D&D 5e, ao voar o personagem se desloca em linha reta (hipotenusa),
 * composta por um componente horizontal (X) e um vertical (Y).
 *
 * a² + b² = c²
 * onde a = eixo X, b = eixo Y, c = hipotenusa (movimento total)
 */

const DECIMAL_PLACES = 2;

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Calcula a hipotenusa (movimento total) dados os catetos X e Y.
 * @param x Movimento horizontal (deve ser >= 0)
 * @param y Movimento vertical (deve ser >= 0)
 * @returns Hipotenusa arredondada a 2 casas decimais, ou 0 se inputs inválidos
 */
export function calcHypotenuse(x: number, y: number): number {
  if (x < 0 || y < 0) {
    return 0;
  }
  return roundTo(Math.sqrt(x * x + y * y), DECIMAL_PLACES);
}

/**
 * Calcula um cateto dado a hipotenusa e o outro cateto.
 * @param hypotenuse Movimento total (deve ser >= 0)
 * @param otherCathetus O outro cateto conhecido (deve ser >= 0)
 * @returns Cateto calculado arredondado a 2 casas decimais, ou 0 se impossível
 */
export function calcCathetus(
  hypotenuse: number,
  otherCathetus: number,
): number {
  if (hypotenuse < 0 || otherCathetus < 0) {
    return 0;
  }
  if (hypotenuse < otherCathetus) {
    return 0;
  }
  return roundTo(
    Math.sqrt(hypotenuse * hypotenuse - otherCathetus * otherCathetus),
    DECIMAL_PLACES,
  );
}
