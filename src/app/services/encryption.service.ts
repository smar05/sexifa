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
  private publicKey: string = null;

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

    console.log('🚀 ~ EncryptionService ~ loadPublicKey ~ res:', res);

    this.publicKey = res.data.key;
  }

  /**
   * Encryptar los datos
   *
   * @param {string} data
   * @return {*}  {string}
   * @memberof EncryptionService
   */
  public encryptData(data: string): string {
    if (!this.publicKey) return null;

    const publicKey: forge.pki.rsa.PublicKey = forge.pki.publicKeyFromPem(
      this.publicKey
    );
    const encrypted: forge.Bytes = publicKey.encrypt(data, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: forge.mgf.mgf1.create(forge.md.sha1.create()),
    });
    return forge.util.encode64(encrypted);
  }

  /**
   * Encryptar datos dentro de un json
   *
   * @param {object} data
   * @return {*}  {object}
   * @memberof EncryptionService
   */
  public encryptDataJson(data: object): object {
    Object.keys(data).forEach((key: string) => {
      data[key] = data[key] ? this.encryptData(data[key]) : undefined;
    });

    return data;
  }
}
