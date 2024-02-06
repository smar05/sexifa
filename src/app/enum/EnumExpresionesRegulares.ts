export let EnumExpresioncesRegulares = {
  NUMEROS_ENTEROS_POSITIVOS: /^\d+$/,
  NUMEROS_REALES_POSITIVOS: /^\d+(\.\d+)?$/,
  CARACTERES: /[.\\,\\0-9a-zA-ZáéíóúñÁÉÍÓÚ ]/,
  CARACTERES_URL: /^(?![_-])[a-zA-Z0-9]+(?:[_-][a-zA-Z0-9]+)*(?![_-])$/,
  NO_ESPACIO: /^[^\s]+$/,
};
