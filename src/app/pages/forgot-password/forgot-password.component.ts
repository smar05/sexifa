import { UrlPagesEnum } from './../../enum/urlPagesEnum';
import { Router } from '@angular/router';
import { RegisterService } from './../../services/register.service';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  //Grupo de controles
  public f: any = this.form.group({
    email: ['', [Validators.required, Validators.email]],
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
    private router: Router
  ) {}

  ngOnInit(): void {
    localStorage.clear();
  }

  public onSubmit(f: any): void {
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
        this.loading = false;
      })
      .catch((error: any) => {
        this.loading = false;
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
