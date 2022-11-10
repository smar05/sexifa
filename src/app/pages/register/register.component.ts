import { UrlPagesEnum } from './../../enum/urlPagesEnum';
import { LocationService } from './../../services/location.service';
import { UserService } from './../../services/user.service';
import { alerts } from 'src/app/helpers/alerts';
import { RegisterService } from './../../services/register.service';
import { functions } from 'src/app/helpers/functions';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { Iregister } from 'src/app/interface/iregister';
import { Router } from '@angular/router';
import { Iuser } from 'src/app/interface/iuser';
import { ICountries } from 'src/app/interface/icountries';
import { IState } from 'src/app/interface/istate';
import { ICities } from 'src/app/interface/icities';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public allCountries: ICountries[] = [];
  public allStatesByCountry: IState[] = [];
  public allCities: ICities[] = [];

  //Grupo de controles
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
    country: ['', [Validators.required]],
    state: ['', [Validators.required]],
    city: ['', [Validators.required]],
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

  get country() {
    return this.f.controls.country;
  }

  get state() {
    return this.f.controls.state;
  }

  get city() {
    return this.f.controls.city;
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

  constructor(
    private form: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private userService: UserService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.getCountries();
  }

  public async onSubmit(f: any): Promise<void> {
    this.formSubmitted = true; //Formulario enviado

    //Formulario correcto
    if (!this.formValid()) {
      alerts.basicAlert('Error', 'Formulario invalido', 'error');
      return;
    }

    //Capturamos la informacion del formulario de la interfaz
    const data: Iregister = {
      email: this.f.controls.email.value,
      password: this.f.controls.password.value,
    };

    this.loading = true;

    try {
      let resp: any = await this.registerService.registerAuth(data);
      const uid: string = resp.user.uid;

      this.registerService.verificEmail().then((res: any) => {
        alerts.basicAlert(
          'Correo enviado',
          'Se te ha enviado un correo para verificacion',
          'info'
        );
      });

      const user: Iuser = {
        id: uid,
        name: this.name.value,
        email: this.email.value,
        celphone: this.celphone.value,
        bornDate: new Date(this.bornDate.value),
        sex: this.sex.value,
        active: true,
        country: this.country.value,
        state: this.state.value,
        city: this.city.value,
      };

      await this.userService.postData(user).toPromise();

      this.loading = false;

      this.router.navigateByUrl(`/${UrlPagesEnum.LOGIN}`);
    } catch (error: any) {
      console.error(error);

      let code: string = error.code;
      let errorText: string = '';

      switch (code) {
        case 'auth/email-already-in-use':
          errorText = 'El usuario ya existe';
          break;

        case 'auth/weak-password':
          errorText = 'La contraseña es muy debil';
          break;

        case 'auth/invalid-email':
          errorText = 'El correo es invalido';
          break;

        default:
          errorText = 'Se ha producido un error en el registro';
          break;
      }

      alerts.basicAlert('Error', errorText, 'error');
      this.loading = false;
    }
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

  public passwordCoincidence(): boolean {
    return this.password.value === this.repeatPassword.value;
  }

  public mayor18Anios(): boolean {
    let hoy: Date = new Date();
    let mayor18: Date = new Date();
    let date: Date = new Date(this.bornDate.value);

    mayor18.setFullYear(hoy.getFullYear() - 18);

    return mayor18 >= date;
  }

  public formValid(): boolean {
    return !this.f.invalid && this.passwordCoincidence() && this.mayor18Anios();
  }

  public async getCountries(): Promise<void> {
    try {
      this.allCountries = JSON.parse(
        await this.locationService.getAllContries()
      );
    } catch (error) {
      this.allCountries = [];
    }
  }

  public async countryChange(): Promise<void> {
    try {
      this.state.setValue(null);
      this.city.setValue(null);
      this.allStatesByCountry = JSON.parse(
        await this.locationService.getAllStatesByCountry(this.country.value)
      );
    } catch (error) {
      this.state.setValue(null);
      this.city.setValue(null);
      this.allStatesByCountry = [];
    }
  }

  public async stateChange(): Promise<void> {
    try {
      this.city.setValue(null);
      this.allCities = JSON.parse(
        await this.locationService.getAllCitiesByCountryAndState(
          this.country.value,
          this.state.value
        )
      );
    } catch (error) {
      this.state.setValue(null);
      this.city.setValue(null);
      this.allCities = [];
    }
  }
}
