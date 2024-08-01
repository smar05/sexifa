export interface Iuser {
  id?: string;
  name?: string;
  email?: string;
  celphone?: number;
  bornDate?: string;
  sex?: string;
  status?: string;
  country?: string;
  state?: string;
  city?: string;
  chatId?: number;
  type?: string;
  date_created?: string;
  last_login?: string;
  document_type: string;
  document_value: string;
}

export enum EnumUserDocumentType {
  CC = 'cc', // Documento nacional
  CE = 'ce', // identificacion extranjera
  PPN = 'ppn', // Pasaporte
}
