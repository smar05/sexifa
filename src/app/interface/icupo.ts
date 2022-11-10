export interface Icupo {
  id?: number;
  idUser?: string;
  state?: StateCupoEnum;
}

export enum StateCupoEnum {
  AVAILABLE = 'AVAILABLE', //Disponible
  SOLD = 'SOLD', //Vendido
  SELECT = 'SELECT', //Seleccionado
}
