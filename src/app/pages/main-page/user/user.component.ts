import { ICities } from './../../../interface/icities';
import { IState } from './../../../interface/istate';
import { ICountries } from './../../../interface/icountries';
import { LocationService } from './../../../services/location.service';
import { Iuser } from 'src/app/interface/iuser';
import { IQueryParams } from './../../../interface/i-query-params';
import { UserService } from './../../../services/user.service';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { LocalStorageEnum } from 'src/app/enum/localStorageEnum';

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
    country: ['', [Validators.required]],
    state: ['', [Validators.required]],
    city: ['', [Validators.required]],
    sex: ['', [Validators.required]],
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
  private nameUserId: string = '';

  public allCountrys: ICountries[] = [];
  public allStates: IState[] = [];
  public allCities: ICities[] = [];

  constructor(
    private form: FormBuilder,
    private userService: UserService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.getUserData();
    this.getLocationData();
  }

  public getUserData(): void {
    let params: IQueryParams = {
      orderBy: '"id"',
      equalTo: `"${localStorage.getItem(LocalStorageEnum.LOCAL_ID)}"`,
    };
    this.userService
      .getData(params)
      .toPromise()
      .then((data: any) => {
        let user: Iuser = Object.keys(data).map((a: any) => {
          this.nameUserId = a;
          return data[a];
        })[0];
        this.name.setValue(user.name);
        this.email.setValue(user.email);
        this.celphone.setValue(user.celphone);
        this.bornDate.setValue(user.bornDate);
        this.sex.setValue(user.sex);
        this.country.setValue(user.country);
        this.state.setValue(user.state);
        this.city.setValue(user.city);
      });
  }

  public async onSubmit(f: any): Promise<void> {
    //Validacion del formulario
    if (this.f.invalid) {
      alerts.basicAlert('Error', 'El formulario es invalido', 'warning');
      return;
    }

    this.loading = true;

    const data: Iuser = {
      name: this.name.value,
      celphone: this.celphone.value,
      sex: this.sex.value,
      country: this.country.value,
      state: this.state.value,
      city: this.city.value,
    };

    this.userService
      .patchData(this.nameUserId, data)
      .toPromise()
      .then(
        (res: any) => {
          alerts.basicAlert(
            'Listo',
            'Se ha guardado la informacion del usuario',
            'success'
          );
          this.loading = false;
        },
        (error: any) => {
          alerts.basicAlert(
            'Error',
            'Ha ocurrido un error al guardar la informacion del usuario',
            'error'
          );
        }
      );
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

  public mayor18Anios(): boolean {
    let hoy: Date = new Date();
    let mayor18: Date = new Date();
    let date: Date = new Date(this.bornDate.value);

    mayor18.setFullYear(hoy.getFullYear() - 18);

    return mayor18 >= date;
  }

  public async getLocationData(): Promise<void> {
    try {
      this.allCountrys = JSON.parse(
        await this.locationService.getAllContries()
      );
      this.allStates = JSON.parse(
        await this.locationService.getAllStatesByCountry(this.country.value)
      );
      this.allCities = JSON.parse(
        await this.locationService.getAllCitiesByCountryAndState(
          this.country.value,
          this.state.value
        )
      );
    } catch (error) {
      this.allCountrys = [];
      this.allStates = [];
      this.allCities = [];
    }
  }

  public async countryChange(): Promise<void> {
    try {
      this.state.setValue(null);
      this.city.setValue(null);
      this.allStates = JSON.parse(
        await this.locationService.getAllStatesByCountry(this.country.value)
      );
    } catch (error) {
      this.allStates = [];
      this.state.setValue(null);
      this.city.setValue(null);
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
      this.allCities = [];
      this.city.setValue(null);
    }
  }
}
