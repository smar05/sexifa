export interface IMetodosDePago {
  id?: string;
  name: string;
  status: string;
}

export enum EnumMetodosDePagoStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
