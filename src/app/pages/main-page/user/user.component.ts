import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  public f: any = this.form.group({
    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/[.\\,\\0-9a-zA-ZáéíóúñÁÉÍÓÚ ]{1,50}/),
      ],
    ],
    email: ['', [Validators.required, Validators.email]],
    celphone: [
      '',
      [
        Validators.required,
        Validators.max(9999999999),
        Validators.pattern(/^[0-9]+$/),
      ],
    ],
    bornDate: ['', [Validators.required]],
    sex: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    repeatPassword: ['', [Validators.required]],
    terms: ['', [Validators.required]],
  });

  //Validaciones personalizadas
  get name() {
    return this.f.controls.name;
  }

  get email() {
    return this.f.controls.email;
  }

  get celphone() {
    return this.f.controls.celphone;
  }

  get bornDate() {
    return this.f.controls.bornDate;
  }

  get sex() {
    return this.f.controls.sex;
  }

  get password() {
    return this.f.controls.password;
  }

  get repeatPassword() {
    return this.f.controls.repeatPassword;
  }

  get terms() {
    return this.f.controls.terms;
  }

  public formSubmitted: boolean = false;
  public loading: boolean = false;

  constructor(private form: FormBuilder) {}

  ngOnInit(): void {}

  public async onSubmit(f: any): Promise<void> {}

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

  public mayor18Anios(): boolean {
    let hoy: Date = new Date();
    let mayor18: Date = new Date();
    let date: Date = new Date(this.bornDate.value);

    mayor18.setFullYear(hoy.getFullYear() - 18);

    return mayor18 >= date;
  }
}
