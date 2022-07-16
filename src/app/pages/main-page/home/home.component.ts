import { ModelsDTO } from './../../../dto/models-dto';
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
  public models: ModelsDTO[] | null = [];

  constructor(
    private categoriesService: CategoriesService,
    private modelsService: ModelsService,
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
    let queryParams: IQueryParams = {
      orderBy: '"name"',
    };
    this.modelsService.getData(queryParams).subscribe(
      async (res: Imodels[]) => {
        let imodels: Imodels[] = res;

        //Imodel to DTO
        imodels.forEach(async (imodel: Imodels) => {
          this.models?.push(
            await this.modelsService.modelInterfaceToDTO(imodel)
          );
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
