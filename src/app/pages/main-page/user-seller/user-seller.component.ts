import { Component } from '@angular/core';
import { QueryFn } from '@angular/fire/compat/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalStorageEnum } from 'src/app/enum/localStorageEnum';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';
import { ICities } from 'src/app/interface/icities';
import { ICountries } from 'src/app/interface/icountries';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';
import { IState } from 'src/app/interface/istate';
import { Iuser } from 'src/app/interface/iuser';
import { LocationService } from 'src/app/services/location.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-seller',
  templateUrl: './user-seller.component.html',
  styleUrls: ['./user-seller.component.css'],
})
export class UserSellerComponent {
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
  private user!: Iuser;

  public allCountrys: ICountries[] = [];
  public allStates: IState[] = [];
  public allCities: ICities[] = [];

  constructor(
    private form: FormBuilder,
    private userService: UserService,
    private locationService: LocationService
  ) {}

  async ngOnInit(): Promise<void> {
    functions.bloquearPantalla(true);
    try {
      await this.getUserData();
      await this.getLocationData();
    } catch (error) {
      console.error('Error: ', error);
      alerts.basicAlert('Error', 'Ha ocurrido un error', 'error');
    }
    functions.bloquearPantalla(false);
  }

  public async getUserData(): Promise<void> {
    functions.bloquearPantalla(true);
    this.loading = true;
    let qf: QueryFn = (ref) =>
      ref.where('id', '==', localStorage.getItem(LocalStorageEnum.LOCAL_ID));

    this.user = await new Promise((resolve) => {
      this.userService
        .getDataFS(qf)
        .toPromise()
        .then(
          (data: IFireStoreRes[]) => {
            this.nameUserId = data[0].id;
            resolve(data[0].data);
          },
          (err) => {
            console.error(err);
            alerts.basicAlert(
              'Error',
              'Ha ocurrido un error en la consulta de usuarios',
              'error'
            );
            resolve(null);
          }
        );
    });

    this.name.setValue(this.user.name);
    this.email.setValue(this.user.email);
    this.celphone.setValue(this.user.celphone);
    this.bornDate.setValue(this.user.bornDate);
    this.sex.setValue(this.user.sex);
    this.country.setValue(this.user.country);
    this.state.setValue(this.user.state);
    this.city.setValue(this.user.city);

    functions.bloquearPantalla(false);
    this.loading = false;
  }

  public async onSubmit(f: any): Promise<void> {
    //Validacion del formulario
    if (this.f.invalid) {
      alerts.basicAlert('Error', 'El formulario es invalido', 'warning');
      return;
    }

    functions.bloquearPantalla(true);
    this.loading = true;

    const data: Iuser = {
      id: this.user.id,
      name: this.name.value,
      email: this.user.email,
      celphone: this.celphone.value,
      bornDate: this.user.bornDate,
      sex: this.sex.value,
      status: this.user.status,
      country: this.country.value,
      state: this.state.value,
      city: this.city.value,
      chatId: this.user.chatId,
      type: this.user.type,
    };

    this.userService.patchDataFS(this.nameUserId, data).then(
      (res: any) => {
        alerts.basicAlert(
          'Listo',
          'Se ha guardado la informacion del usuario',
          'success'
        );
        functions.bloquearPantalla(false);
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
    functions.bloquearPantalla(true);
    this.loading = true;
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

      functions.bloquearPantalla(false);
      this.loading = false;
    } catch (error) {
      console.error('Error: ', error);
      functions.bloquearPantalla(false);
      this.loading = false;
      this.allCountrys = [];
      this.allStates = [];
      this.allCities = [];
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de ubicaciones',
        'error'
      );
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
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de ubicaciones',
        'error'
      );
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
      console.error('Error: ', error);
      alerts.basicAlert(
        'Error',
        'Ha ocurrido un error en la consulta de ubicaciones',
        'error'
      );
      this.allCities = [];
      this.city.setValue(null);
    }
  }
}
