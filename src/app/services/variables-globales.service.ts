import { Injectable } from '@angular/core';
import { EnumVariablesGlobales } from '../enum/enum-variables-globales';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VariablesGlobalesService {
  private variables: Map<string, BehaviorSubject<any>> = new Map();

  constructor() {}

  /**
   * Almacenar un valor
   *
   * @param {EnumVariablesGlobales} key
   * @param {*} value
   * @memberof VariablesGlobalesService
   */
  public set(key: EnumVariablesGlobales, value: any): void {
    if (this.variables.has(key)) {
      this.variables.get(key)?.next(value);
    } else {
      this.variables.set(key, new BehaviorSubject(value));
    }
  }

  /**
   * Obtener un valor como observable
   *
   * @param {EnumVariablesGlobales} key
   * @return {*}  {(Observable<any> | undefined)}
   * @memberof VariablesGlobalesService
   */
  public getVariable(key: EnumVariablesGlobales): Observable<any> | undefined {
    return this.variables.get(key)?.asObservable();
  }

  /**
   * Obtener un valor
   *
   * @param {EnumVariablesGlobales} key
   * @return {*}  {*}
   * @memberof VariablesGlobalesService
   */
  public getCurrentValue(key: EnumVariablesGlobales): any {
    return this.variables.get(key)?.getValue();
  }
}
