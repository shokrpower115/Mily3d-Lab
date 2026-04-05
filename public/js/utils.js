export function generarId(numero) {
  return `PET-${numero.toString().padStart(3, "0")}`;
}