import { Icupo } from './icupo';
export interface Irifas {
  state?: StateRifas;
  created?: Date;
  finish?: Date;
  winnerId?: string;
  winningNumber?: number;
  listCupos: Icupo[];
}

export enum StateRifas {
  ACTIVE = 'ACTIVE', //Activo
  FINISHED = 'FINISHED', //Finalizada
  CANCELED = 'CANCELED', //Anulada
}
