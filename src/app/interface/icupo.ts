export interface Icupo {
  id?: number;
  idUser?: string;
  state?: StateCupo;
}

export enum StateCupo {
  AVAILABLE = 'AVAILABLE', //Disponible
  SOLD = 'SOLD', //Vendido
  SELECT = 'SELECT', //Seleccionado
}
