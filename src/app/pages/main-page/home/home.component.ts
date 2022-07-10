import { IQueryParams } from './../../../interface/i-query-params';
import { FontAwesomeIconsService } from './../../../shared/font-awesome-icons/font-awesome-icons.service';
import { Icategories } from './../../../interface/icategories';
import { CategoriesService } from './../../../services/categories.service';
import { Component, OnInit } from '@angular/core';
import { functions } from 'src/app/helpers/functions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public categories: Icategories[] | null = [];
  public faMars: any;

  constructor(
    private categoriesService: CategoriesService,
    public fontAwesomeIconsService: FontAwesomeIconsService
  ) {
    this.faMars = fontAwesomeIconsService.getIcon('faMars');
  }

  ngOnInit(): void {
    this.getAllCategories();
  }

  public getAllCategories() {
    this.categoriesService.getData().subscribe(
      (res: Icategories[]) => {
        this.categories = res;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
