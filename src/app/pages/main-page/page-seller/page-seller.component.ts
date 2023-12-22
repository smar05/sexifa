import { Component } from '@angular/core';
import { Icategories } from 'src/app/interface/icategories';
import { ActiveModelEnum, Imodels } from 'src/app/interface/imodels';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ModelsService } from 'src/app/services/models.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ImgModelEnum } from 'src/app/enum/imgModelEnum';
import { alerts } from 'src/app/helpers/alerts';
import { functions } from 'src/app/helpers/functions';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { UserService } from 'src/app/services/user.service';
import { Iuser } from 'src/app/interface/iuser';
import { LocalStorageEnum } from 'src/app/enum/localStorageEnum';
import { IpriceModel } from 'src/app/interface/iprice-model';
import { UrlPagesEnum } from 'src/app/enum/urlPagesEnum';
import { QueryFn } from '@angular/fire/compat/firestore';
import { IFireStoreRes } from 'src/app/interface/ifireStoreRes';

@Component({
  selector: 'app-page-seller',
  templateUrl: './page-seller.component.html',
  styleUrls: ['./page-seller.component.css'],
})
export class PageSellerComponent {
  public modelEnDb!: Imodels;
  public galeriaValores: Map<string, string> = new Map(); // <url,nombre>
  public imagenesABorrarGaleria: string[] = [];

  public f = this.form.group({
    name: [
      '',
      {
        validators: [Validators.required, Validators.maxLength(50)],
      },
    ],
    category: ['', [Validators.required]],
    image: ['', []], //No se guarda en base de datos
    description: ['', [Validators.required]],
    price: new UntypedFormArray([]),
    groupId: ['', [Validators.required]],
  });

  //Validaciones personalizadas
  get name() {
    return this.f.controls.name;
  }

  get groupId() {
    return this.f.controls.groupId;
  }

  get category() {
    return this.f.controls.category;
  }

  get image() {
    return this.f.controls.image;
  }

  get description() {
    return this.f.controls.description;
  }

  get price() {
    return this.f.controls.price as any;
  }

  //Variable para validar el envio del formulario
  public formSubmitted: boolean = false;

  //Variable de precarga
  public loadData: boolean = false;

  //Variable global de la url
  public urlInput: string = '';

  //Variable con las categorias
  public categories: Icategories[] = [];
  public categoryName: string = '';

  //Variable para el listado de titulo
  public titleList: string = '';

  //Variable para la imagen del producto
  public imgTemp: string = '';
  public imgFile!: File;

  //Galeria de imagenes del producto
  public files: File[] = [];
  public editGallery: string[] = [];
  public allGallery: string[] = [];

  private userModel!: Iuser;

  private userId!: string;

  //Configuracion summernote
  config = {
    placeholder: '',
    tabsize: 2,
    height: 400,
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'link', 'hr']],
    ],
    fontNames: [
      'Helvetica',
      'Arial',
      'Arial Black',
      'Comic Sans MS',
      'Courier New',
      'Roboto',
      'Times',
    ],
  };

  //Configuracion matChip
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private modelService: ModelsService,
    private form: UntypedFormBuilder,
    private categoriesService: CategoriesService,
    private userService: UserService,
    private route: Router
  ) {}

  async ngOnInit(): Promise<void> {
    functions.bloquearPantalla(true);
    this.userId = localStorage.getItem(LocalStorageEnum.LOCAL_ID) || '';
    this.getCategories();
    await this.getUserModel();
    await this.getData();
    functions.bloquearPantalla(false);
  }

  /**
   * Se obtiene el usuario del modelo
   *
   * @return {*}  {Promise<void>}
   * @memberof PageSellerComponent
   */
  public async getUserModel(): Promise<void> {
    functions.bloquearPantalla(true);
    this.loadData = true;
    let qf: QueryFn = (ref) => ref.where('id', '==', this.userId);

    this.userModel = await new Promise((resolve) => {
      this.userService
        .getDataFS(qf)
        .toPromise()
        .then(
          (res: IFireStoreRes[]) => {
            functions.bloquearPantalla(false);
            this.loadData = false;
            resolve(res[0].data);
          },
          (err) => {
            functions.bloquearPantalla(false);
            this.loadData = false;
            console.error(err);
            resolve(null);
          }
        );
    });
  }

  public async getData(): Promise<void> {
    functions.bloquearPantalla(true);
    this.loadData = true;

    // Se obtiene el modelo del usuario actual
    let qf: QueryFn = (ref) => ref.where('idUser', '==', this.userId);
    this.modelEnDb = await new Promise((resolve) => {
      this.modelService
        .getDataFS(qf)
        .toPromise()
        .then(
          (res: IFireStoreRes[]) => {
            if (res.length == 0) {
              resolve(null);
              return;
            }
            let model: Imodels = res[0].data;
            model.id = res[0].id;
            resolve(model);
          },
          (err) => {
            console.error(err);
            resolve(null);
          }
        );
    });

    if (this.modelEnDb && this.modelEnDb.id) {
      this.name.setValue(this.modelEnDb.name);
      this.categoryName = this.modelEnDb.categorie || '';
      this.category.setValue(this.modelEnDb.categorie);
      this.description.setValue(this.modelEnDb.description);
      this.groupId.setValue(this.modelEnDb.groupId);

      if (this.modelEnDb && this.modelEnDb.price)
        this.modelEnDb.price.forEach((price: IpriceModel, index: number) => {
          this.price.push(
            this.form.group({
              time: [
                price.time,
                [
                  Validators.required,
                  Validators.min(1),
                  Validators.max(24),
                  Validators.pattern(/^[0-9]+$/),
                ],
              ],
              value: [
                price.value,
                [
                  Validators.required,
                  Validators.min(0),
                  Validators.pattern(/^[0-9]+$/),
                ],
              ],
              value_offer: [
                price.value_offer,
                [Validators.min(0), Validators.pattern(/^[0-9]+$/)],
              ],
              type_offer: [price.type_offer, []],
              date_offer: [price.date_offer, []],
            })
          );
        });

      //Obtener imagenes del producto
      this.imgTemp = await this.modelService.getImage(
        `${this.modelEnDb.id}/${ImgModelEnum.MAIN}`
      );

      if (this.modelEnDb.gallery) {
        JSON.parse(this.modelEnDb.gallery).forEach(
          async (galleryItem: string) => {
            let urlImage: string = await this.modelService.getImage(
              `${this.modelEnDb.id}/${ImgModelEnum.GALLERY}/${galleryItem}`
            );
            this.allGallery.push(urlImage);
            this.editGallery.push(urlImage);
            this.galeriaValores.set(urlImage, galleryItem);
          }
        );
      }
    }
    functions.bloquearPantalla(false);
    this.loadData = false;
  }

  /**
   * Guardar modelo
   *
   * @return {*}  {Promise<void>}
   * @memberof PageSellerComponent
   */
  public async saveModel(): Promise<void> {
    this.formSubmitted = true;

    //Validamos que el formulario este correcto
    if (this.f.invalid) {
      alerts.basicAlert(
        'Error',
        'Se encontro un error en el formulario',
        'error'
      );
      return;
    }
    if (!this.validarPrecios(this.f.controls.price.value)) {
      alerts.basicAlert(
        'Error',
        'El precio final no puede ser 0 o negativo',
        'error'
      );
      return;
    }
    if (this.files.length + this.editGallery.length > 4) {
      alerts.basicAlert(
        'Error',
        'Ha seleccionado mas de 4 imagenes de la galeria',
        'error'
      );
      return;
    }
    functions.bloquearPantalla(true);
    this.loadData = true;

    //Informacion del formulario en la interfaz
    const dataModel: Imodels = {
      categorie: this.f.controls.category.value,
      description: this.f.controls.description.value,
      name: this.f.controls.name.value.trim().toLowerCase(),
      price: this.f.controls.price.value,
      gallery:
        this.modelEnDb && this.modelEnDb.id ? this.modelEnDb.gallery : '',
      groupId: this.f.controls.groupId.value,
      active:
        this.modelEnDb && this.modelEnDb.id
          ? this.modelEnDb.active
          : ActiveModelEnum.ACTIVO,
      idUser: this.userModel.id,
    };

    //Guardar la informacion del producto en base de datos

    // Actualizar informacion
    if (this.modelEnDb && this.modelEnDb.id) {
      this.modelService.patchDataFS(this.modelEnDb.id, dataModel).then(
        (res: any) => {
          console.log(
            '🚀 ~ file: page-seller.component.ts:321 ~ PageSellerComponent ~ saveModel ~ res:',
            res
          );
          this.save(this.modelEnDb.id, dataModel, 'update');
        },
        (err: any) => {
          functions.bloquearPantalla(false);
          this.loadData = false;
          alerts.basicAlert(
            'Error',
            'No se han podido actualizar los datos',
            'error'
          );
        }
      );
    } else {
      //Crear informacion
      this.modelService.postDataFS(dataModel).then(
        (res: any) => {
          this.save(res.id, dataModel, 'save');
        },
        (err: any) => {
          functions.bloquearPantalla(false);
          this.loadData = false;
          alerts.basicAlert(
            'Error',
            'No se han podido actualizar los datos',
            'error'
          );
        }
      );
    }
  }

  /**
   *
   *
   * @private
   * @param {*} res
   * @param {Imodels} dataModel
   * @param {string} saveOrUpdate
   * @return {*}  {Promise<void>}
   * @memberof PageSellerComponent
   */
  private async save(
    res: any,
    dataModel: Imodels,
    saveOrUpdate: string
  ): Promise<void> {
    if (saveOrUpdate == 'save') {
      //Guardar las imagenes en storage
      if (this.imgFile && this.imgTemp) {
        await this.modelService.deleteImages(`${res}/${ImgModelEnum.MAIN}`);
        await this.saveProductImages(res, this.imgFile, ImgModelEnum.MAIN);
      }

      let nombreGaleriaAGuardar: string[] = [];
      // Se guardan las imagenes nuevas
      if (this.files && this.files.length > 0) {
        let nombres: string[] = await this.saveProductGallery(res, this.files);
        nombreGaleriaAGuardar = nombreGaleriaAGuardar.concat(nombres);
      }
      // Se eliminan las imagenes antiguas que el usuario quizo borrar
      if (
        this.imagenesABorrarGaleria &&
        this.imagenesABorrarGaleria.length > 0 &&
        dataModel.gallery
      ) {
        this.imagenesABorrarGaleria.forEach(async (url: string) => {
          let name: string | undefined = this.galeriaValores.get(url);

          dataModel.gallery = JSON.stringify(
            JSON.parse(dataModel.gallery || '').filter(
              (nameEnDB: string) => nameEnDB != name
            )
          );

          await this.modelService.deleteImages(
            `${res}/${ImgModelEnum.GALLERY}/${name}`
          );
        });
      }

      nombreGaleriaAGuardar = nombreGaleriaAGuardar.concat(
        JSON.parse(dataModel.gallery)
      );

      dataModel.gallery = JSON.stringify(nombreGaleriaAGuardar);

      if (dataModel.gallery)
        await this.modelService.patchDataFS(res, dataModel);

      functions.bloquearPantalla(false);
      this.loadData = false;
      alerts.basicAlert('Listo', 'La información ha sido guardado', 'success');

      this.route.navigate([`/${UrlPagesEnum.HOME_SELLER}`]);
    } else if (
      saveOrUpdate == 'update' &&
      this.modelEnDb &&
      this.modelEnDb.id
    ) {
      //Guardar las imagenes en storage
      if (this.imgFile && this.imgTemp) {
        await this.modelService.deleteImages(
          `${this.modelEnDb.id}/${ImgModelEnum.MAIN}`
        );
        await this.saveProductImages(
          this.modelEnDb.id,
          this.imgFile,
          ImgModelEnum.MAIN
        );
      }

      let nombreGaleriaAGuardar: string[] = [];
      // Se guardan las imagenes nuevas
      if (this.files && this.files.length > 0) {
        let nombres: string[] = await this.saveProductGallery(
          this.modelEnDb.id,
          this.files
        );
        nombreGaleriaAGuardar = nombreGaleriaAGuardar.concat(nombres);
      }
      // Se eliminan las imagenes antiguas que el usuario quizo borrar
      if (
        this.imagenesABorrarGaleria &&
        this.imagenesABorrarGaleria.length > 0 &&
        dataModel.gallery
      ) {
        this.imagenesABorrarGaleria.forEach(async (url: string) => {
          let name: string | undefined = this.galeriaValores.get(url);

          dataModel.gallery = JSON.stringify(
            JSON.parse(dataModel.gallery || '').filter(
              (nameEnDB: string) => nameEnDB != name
            )
          );

          await this.modelService.deleteImages(
            `${this.modelEnDb.id}/${ImgModelEnum.GALLERY}/${name}`
          );
        });
      }

      nombreGaleriaAGuardar = nombreGaleriaAGuardar.concat(
        JSON.parse(dataModel.gallery)
      );

      dataModel.gallery = JSON.stringify(nombreGaleriaAGuardar);

      if (dataModel.gallery)
        await this.modelService.patchDataFS(this.modelEnDb.id, dataModel);

      functions.bloquearPantalla(false);
      this.loadData = false;
      alerts.basicAlert('Listo', 'La información ha sido guardado', 'success');

      this.route.navigate([`/${UrlPagesEnum.HOME_SELLER}`]);
    }
  }

  //Validamos el formulario
  public invalidField(field: string): boolean {
    return functions.invalidField(field, this.f, this.formSubmitted);
  }

  //Validamos imagen
  public async validateImage(e: any, type: string): Promise<void> {
    let resp: string = '';
    try {
      resp = await functions.validateImage(e);
    } catch (error) {
      console.error(error);
      return;
    }
    if (resp) {
      switch (type) {
        case ImgModelEnum.MAIN:
          this.imgTemp = resp;
          this.imgFile = e.target.files[0];
          break;

        default:
          break;
      }
    } else {
      this.imgTemp = '';
    }
  }

  //Funciones de adicionar y eliminar imagenes de la galeria
  public onSelect(event: any) {
    this.files.push(...event.addedFiles);
  }

  public onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  //Adicionar resumen
  public addItem(e: any, type: string, i: number): void {
    if (type == 'summary') {
      if ((e.target.value || '').trim()) {
        this.f.controls.summary.value.push(e.target.value.trim());
      }
      this.f.controls.summary.updateValueAndValidity();
    }
  }

  public getCategories(): any {
    functions.bloquearPantalla(true);
    this.loadData = true;
    this.categoriesService
      .getData()
      .toPromise()
      .then((resp: any) => {
        functions.bloquearPantalla(false);
        this.loadData = false;
        this.categories = Object.keys(resp).map((a: any) => ({
          id: a,
          active: resp[a].active,
          name: resp[a].name,
          url: resp[a].url,
        }));
      });
  }

  public async saveProductImages(
    idProduct: string,
    imgFile: File,
    type: string
  ): Promise<void> {
    let name: string =
      idProduct && type && imgFile
        ? `${type}.${imgFile.name.split('.')[1]}`
        : '';

    if (name) {
      try {
        if (imgFile && idProduct)
          await this.modelService.saveImage(
            imgFile,
            `${idProduct}/${type}/${name}`
          );
      } catch (error) {
        alerts.basicAlert(
          'Error',
          `Ha ocurrido un error guardando la imagen ${type}`,
          'error'
        );
        functions.bloquearPantalla(false);
        this.loadData = false;
        return;
      }
    }
  }

  public async saveProductGallery(
    idProduct: string,
    gallery: File[]
  ): Promise<string[]> {
    let nombres: string[] = [];

    for (let index = 0; index < gallery.length; index++) {
      let nameSinTipo: string = `${new Date().getTime()}_${index}`;
      let name: string =
        idProduct && gallery[index]
          ? `${nameSinTipo}.${gallery[index].name.split('.')[1]}`
          : '';

      if (name && idProduct) {
        try {
          await this.modelService.saveImage(
            gallery[index],
            `${idProduct}/${ImgModelEnum.GALLERY}/${nameSinTipo}/${name}`
          );

          nombres.push(nameSinTipo);
        } catch (error) {
          alerts.basicAlert(
            'Error',
            `Ha ocurrido un error guardando la imagen de la galeria del producto`,
            'error'
          );
          functions.bloquearPantalla(false);
          this.loadData = false;
        }
      }
    }

    return nombres;
  }

  //Remover fotos de la galeria
  public removeGallery(pic: string): void {
    this.editGallery.splice(this.editGallery.indexOf(pic), 1);
    this.allGallery.splice(this.editGallery.indexOf(pic), 1);
    this.imagenesABorrarGaleria.push(pic);
  }

  //Matchips
  public add(
    event: MatChipInputEvent | any,
    index: number,
    type: string
  ): void {
    const value = (event.value || '').trim();
    if (type == 'tags') {
      this.f.controls.tags.value.push(value.trim());
      this.f.controls.tags.updateValueAndValidity();
    }
  }

  public remove(value: any, index: number, type: string): void {
    if (type == 'tags') {
      const index = this.f.controls.tags.value.indexOf(value);
      if (index >= 0) {
        this.f.controls.tags.value.splice(index, 1);
        this.f.controls.tags.updateValueAndValidity();
      }
    }
  }

  //Adicionar input's dinamicos
  public addInput(type: string): void {
    if (type == 'price') {
      if (this.price.length < 5) {
        this.price.push(
          this.form.group({
            time: [
              '',
              [
                Validators.required,
                Validators.min(1),
                Validators.max(24),
                Validators.pattern(/^[0-9]+$/),
              ],
            ],
            value: [
              '',
              [
                Validators.required,
                Validators.min(0),
                Validators.pattern(/^[0-9]+$/),
              ],
            ],
            value_offer: [
              '',
              [Validators.min(0), Validators.pattern(/^[0-9]+$/)],
            ],
            type_offer: ['', []],
            date_offer: ['', []],
          })
        );
      } else {
        alerts.basicAlert('Error', 'El limite de detalles es de 5', 'error');
      }
    }
  }

  /**
   * Valida que los precios esten correctos
   *
   * @private
   * @param {IpriceModel[]} precios
   * @return {*}  {boolean}
   * @memberof PageSellerComponent
   */
  private validarPrecios(precios: IpriceModel[]): boolean {
    //Que el precio no sea negativo
    let valido: boolean = true;

    for (let precio of precios) {
      if (this.modelService.calculoPrecioSubscripcion(precio) <= 0) {
        valido = false;

        break;
      }
    }

    return valido;
  }

  //Eliminar input's dinamicos
  public removeInput(i: number, type: string): void {
    if (type == 'price') {
      if (this.price.length > 1) {
        this.price.removeAt(i);
      }
    }
  }

  public calcularPrecio(precio: IpriceModel): number | undefined {
    return this.modelService.calculoPrecioSubscripcion(precio);
  }
}
