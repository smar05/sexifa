import { Icupo } from './icupo';
export interface Irifas {
  state?: StateRifasEnum;
  created?: Date;
  finish?: Date;
  winnerId?: string;
  winningNumber?: number;
  listCupos: Icupo[];
}

export enum StateRifasEnum {
  ACTIVE = 'ACTIVE', //Activo
  FINISHED = 'FINISHED', //Finalizada
  CANCELED = 'CANCELED', //Anulada
}
