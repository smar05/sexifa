export let EnumExpresioncesRegulares = {
  NUMEROS_ENTEROS_POSITIVOS: /^\d+$/ as RegExp,
  NUMEROS_REALES_POSITIVOS: /^\d+(\.\d+)?$/ as RegExp,
  CARACTERES: /[.\\,\\0-9a-zA-ZáéíóúñÁÉÍÓÚ ]/ as RegExp,
  CARACTERES_URL:
    /^(?![_-])[a-zA-Z0-9]+(?:[_-][a-zA-Z0-9]+)*(?![_-])$/ as RegExp,
  NO_ESPACIO: /^[^\s]+$/ as RegExp,
  NUMEROS: /^[0-9]+$/ as RegExp,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/ as RegExp,
};
