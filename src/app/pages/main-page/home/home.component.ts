import { Ipages } from './../../../interface/ipages';
import { PagesService } from './../../../services/pages.service';
import { StorageService } from './../../../services/storage.service';
import { Imodels } from './../../../interface/imodels';
import { ModelsService } from './../../../services/models.service';
import { IQueryParams } from './../../../interface/i-query-params';
import { FontAwesomeIconsService } from './../../../shared/font-awesome-icons/font-awesome-icons.service';
import { Icategories } from './../../../interface/icategories';
import { CategoriesService } from './../../../services/categories.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public categories: Icategories[] | null = [];
  public models: Imodels[] | null = [];
  public mainImages: Map<string, string> = new Map(); //Imagenes principales de los modelos
  public modelPage: Map<string, string> = new Map(); //Pagina a la que pertenece el modelo

  constructor(
    private categoriesService: CategoriesService,
    private modelsService: ModelsService,
    private storageService: StorageService,
    private pagesService: PagesService,
    public fontAwesomeIconsService: FontAwesomeIconsService
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllModels();
  }

  public getAllCategories(): void {
    let queryParams: IQueryParams = {
      orderBy: '"name"',
      limitToFirst: 4,
      print: 'pretty',
    };
    this.categoriesService.getData(queryParams).subscribe(
      (res: Icategories[]) => {
        this.categories = res;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public getAllModels(): void {
    this.modelsService.getData().subscribe(
      (res: Imodels[]) => {
        this.models = res;
        this.setModelMainImages();
        this.getModelPageName();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public async getModelMainImage(model: Imodels): Promise<string> {
    let image: any = (await this.modelsService.getMainImage(model)).items[0];

    let urlImage: string = await this.storageService.getDownloadURL(image);

    return urlImage;
  }

  public setModelMainImages(): void {
    if (this.models && this.models.length > 0) {
      this.models.forEach(async (model: Imodels) => {
        let urlMainImage: string = await this.getModelMainImage(model);
        this.mainImages.set(model.id, urlMainImage);
      });
    }
  }

  public getModelPageName(): void {
    if (this.models && this.models.length > 0) {
      this.models.forEach((model: Imodels) => {
        if (model.page) {
          this.pagesService
            .getItem(model.page)
            .subscribe((modelPage: Ipages) => {
              this.modelPage.set(model.id, modelPage.name);
            });
        }
      });
    }
  }

  /**
   *
   *
   * @param {string} [id=""]
   * @return {*}  {(Icategories | undefined)}
   * @memberof HomeComponent
   */
  public getCategorieById(id: string = ''): Icategories | undefined {
    return this.categories?.find(
      (categorie: Icategories) => id == categorie.id
    );
  }
}
