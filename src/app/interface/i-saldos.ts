export interface ISaldos {
  id?: string;
  date_created: string;
  modelId: string;
  status: string;
  idsSubscriptions: string[];
  price: number;
}

export enum EnumSaldosStatus {
  FINALIZADO = 'finalizado',
  SOLICITADO = 'solicitado',
  ANULADO = 'anulado',
}
