import { Injectable } from '@angular/core';
import { IFireStoreRes } from '../interface/ifireStoreRes';
import {
  BusinessParamsService,
  EnumBusinessParamsKeys,
} from './business-params.service';
import { FrontLogsService } from './front-logs.service';
import * as forge from 'node-forge';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  private publicKey: forge.pki.rsa.PublicKey = null;
  private maxDataSize: number = NaN;

  constructor(
    private businessService: BusinessParamsService,
    private frontLogsService: FrontLogsService
  ) {
    this.loadPublicKey();
  }

  /**
   * Obtener la llave publica para encriptar datos
   *
   * @private
   * @return {*}  {Promise<void>}
   * @memberof EncryptionService
   */
  private async loadPublicKey(): Promise<void> {
    let res: IFireStoreRes = null;

    try {
      res = await this.businessService
        .getItemFS(EnumBusinessParamsKeys.PUBLIC_KEY)
        .toPromise();
    } catch (error) {
      this.frontLogsService.catchProcessError(
        error,
        {
          title: 'Error',
          text: 'Ha ocurrido un error',
          icon: 'error',
        },
        `file: forgot-password.component.ts: ~ ForgotPasswordComponent ~ onSubmit ~ JSON.stringify(error): ${JSON.stringify(
          error
        )}`
      );
    }

    if (!res) {
      throw new Error('Error con la encriptacion');
    }

    this.publicKey = forge.pki.publicKeyFromPem(res.data.key);

    const keySize: number = this.publicKey.n.bitLength();
    const hashLength: number = forge.md.sha256.create().digestLength;
    this.maxDataSize = keySize / 8 - 2 * hashLength - 2;
  }

  /**
   * Encryptar los datos
   *
   * @param {string} data
   * @return {*}  {string}
   * @memberof EncryptionService
   */
  public encryptData(data: string): string {
    if (!this.validateData(data)) return null;

    const encrypted: forge.Bytes = this.publicKey.encrypt(data, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: forge.mgf.mgf1.create(forge.md.sha1.create()),
    });
    return forge.util.encode64(encrypted);
  }

  /**
   * Encryptar datos dentro de un json
   *
   * @param {({[key: string]: string | string[]})} data
   * @return {*}  {object}
   * @memberof EncryptionService
   */
  public encryptDataJson(data: {
    [key: string]: string | Array<string>;
  }): object {
    if (!this.publicKey) return null;

    for (const key of Object.keys(data)) {
      if (!data[key]) {
        delete data[key];
        continue;
      }

      let subData: string[] | string = data[key] || null;

      if (typeof subData === 'object' && (subData as any).length > 0) {
        let dataArray: Array<string> = [];

        for (const d of subData) {
          if (!this.validateData(d)) return null;

          dataArray.push(this.encryptData(String(d)));
        }

        data[key] = JSON.stringify(dataArray);

        continue;
      }

      subData = String(subData);

      if (!this.validateData(subData as string)) {
        delete data[key];
        continue;
      }

      data[key] = subData ? this.encryptData(String(subData)) : undefined;
    }

    return data;
  }

  /**
   * Validacion de los datos
   *
   * @private
   * @param {string} data
   * @return {*}  {boolean}
   * @memberof EncryptionService
   */
  private validateData(data: string): boolean {
    if (!this.publicKey) return false;

    const dataBytes: number = forge.util.createBuffer(data).length();

    if (dataBytes > this.maxDataSize) {
      console.error(
        `Data size (${dataBytes} bytes) exceeds maximum allowed size (${this.maxDataSize} bytes)`
      );
      return false;
    }

    return true;
  }
}
