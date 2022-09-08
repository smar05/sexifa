export interface IQueryParams {
  orderBy?: string; //Ordenar por un parametro de la coleccion
  startAt?: string;
  endAt?: string;
  equalTo?: string | boolean;
  limitToFirst?: number;
  limitToLast?: number;
  print?: string;
}
