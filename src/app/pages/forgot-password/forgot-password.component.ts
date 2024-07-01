import { UrlPagesEnum } from './../../enum/urlPagesEnum';
import { Router } from '@angular/router';
import { RegisterService } from './../../services/register.service';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FrontLogsService } from 'src/app/services/front-logs.service';
import { IFrontLogs } from 'src/app/interface/i-front-logs';
import { LocalStorageEnum } from 'src/app/enum/localStorageEnum';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  //Grupo de controles
  public f: any = this.form.group({
    email: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(320)],
    ],
  });

  //Validaciones personalizadas
  get email() {
    return this.f.controls.email;
  }

  public formSubmitted: boolean = false;
  public loading: boolean = false;

  constructor(
    private form: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private frontLogsService: FrontLogsService
  ) {}

  ngOnInit(): void {
    functions.bloquearPantalla(true);
    localStorage.clear();
    functions.bloquearPantalla(false);
  }

  public onSubmit(f: any): void {
    functions.bloquearPantalla(true);
    this.loading = true;
    this.formSubmitted = true; //Formulario enviado

    //Formulario correcto
    if (this.f.invalid) {
      alerts.basicAlert('Error', 'Formulario invalido', 'error');
      return;
    }

    const email: string = this.email.value;

    this.registerService
      .forgotPassword(email)
      .then((res: any) => {
        alerts.basicAlert(
          'Listo',
          'Se ha enviado el correo para recuperar la contraseña, recuerde revisar la seccion de Spam',
          'success'
        );

        this.router.navigateByUrl(`/${UrlPagesEnum.LOGIN}`);
        functions.bloquearPantalla(false);
        this.loading = false;
      })
      .catch((error: any) => {
        console.error('Error: ', error);

        alerts.basicAlert(
          'Error',
          'Ha ocurrido un error en la recuperacion de la contraseña',
          'error'
        );

        let data: IFrontLogs = {
          date: new Date(),
          userId: localStorage.getItem(LocalStorageEnum.LOCAL_ID),
          log: `file: forgot-password.component.ts: ~ ForgotPasswordComponent ~ onSubmit ~ JSON.stringify(error): ${JSON.stringify(
            error
          )}`,
        };

        this.frontLogsService
          .postDataFS(data)
          .then((res) => {})
          .catch((err) => {
            alerts.basicAlert('Error', 'Error', 'error');
            throw err;
          });

        functions.bloquearPantalla(false);
        this.loading = false;
        throw error;
      });
  }

  /**
   *Validacion del formulario
   *
   * @param {string} field
   * @return {*}  {boolean}
   * @memberof RegisterComponent
   */
  public invalidField(field: string): boolean {
    return functions.invalidField(field, this.f, this.formSubmitted);
  }
}
