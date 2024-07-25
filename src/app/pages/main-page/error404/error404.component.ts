import { Component, OnInit } from '@angular/core';
import { EnumPages } from 'src/app/enum/enum-pages';
import { AlertsPagesService } from 'src/app/services/alerts-page.service';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.css'],
})
export class Error404Component implements OnInit {
  constructor(private alertsPagesService: AlertsPagesService) {}

  ngOnInit(): void {
    this.alertPage();
  }

  private alertPage(): void {
    this.alertsPagesService
      .alertPage(EnumPages.ERROR_404)
      .toPromise()
      .then((res: any) => {});
  }
}
