//import { FontAwesomeIconsService } from './../../../shared/font-awesome-icons/font-awesome-icons.service';
import { CategoriesService } from './../../../services/categories.service';
import { Icategories } from './../../../interface/icategories';
import { Component, OnInit } from '@angular/core';
import { alerts } from 'src/app/helpers/alerts';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  public categories: Icategories[] | null = [];

  constructor(
    private categoriesService: CategoriesService //public fontAwesomeIconsService: FontAwesomeIconsService
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
  }

  public getAllCategories(): void {
    this.categoriesService
      .getData()
      .toPromise()
      .then(
        (res: Icategories[]) => {
          this.categories = res;
        },
        (error) => {
          alerts.basicAlert(
            'Error',
            'Ha ocurrido un error en la consulta de categorias',
            'error'
          );
          console.error(error);
        }
      );
  }
}
