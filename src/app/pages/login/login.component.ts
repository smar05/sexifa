import { LoginService } from './../../services/login.service';
import { Ilogin } from './../../interface/ilogin';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';
import { Router } from '@angular/router';
import '../../shared/spinkit/sk-folding-cube.css';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  //Grupo de controles
  public f: any = this.form.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  public loading: boolean = false;
  public formSubmitted: boolean = false;

  constructor(
    private form: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  public login(): void {
    this.formSubmitted = true; //Formulario enviado

    //Formulario correcto
    if (this.f.invalid) {
      return;
    }

    //Capturamos la informacion del formulario de la interfaz
    const data: Ilogin = {
      email: this.f.controls.email.value,
      password: this.f.controls.password.value,
      returnSecureToken: true,
    };

    //Servicio de login
    this.loading = true;
    this.loginService.login(data).subscribe(
      (resp: any) => {
        //Entramos al sistema
        this.router.navigateByUrl('/');
        this.loading = false;
      },
      (err: any) => {
        //Errores al ingresar
        if (err.error.error.message == 'EMAIL_NOT_FOUND') {
          alerts.basicAlert('Error', 'Correo no encontrado', 'error');
        } else if (err.error.error.message == 'INVALID_PASSWORD') {
          alerts.basicAlert('Error', 'Contraseña invalida', 'error');
        } else if (err.error.error.message == 'INVALID_EMAIL') {
          alerts.basicAlert('Error', 'Correo invalido', 'error');
        } else {
          alerts.basicAlert('Error', 'Ha ocurrido un error', 'error');
        }
        this.loading = false;
      }
    );
  }

  /**
   *Validacion del formulario
   *
   * @param {string} field
   * @return {*}  {boolean}
   * @memberof LoginComponent
   */
  public invalidField(field: string): boolean {
    return functions.invalidField(field, this.f, this.formSubmitted);
  }
}
