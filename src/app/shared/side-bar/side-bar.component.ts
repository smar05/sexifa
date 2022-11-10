import { UrlPagesEnum } from './../../enum/urlPagesEnum';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { LocalStorageEnum } from 'src/app/enum/localStorageEnum';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  //Funcion de salida del sistema
  public logout(): void {
    localStorage.removeItem(LocalStorageEnum.TOKEN);
    localStorage.removeItem(LocalStorageEnum.LOCAL_ID);
    localStorage.removeItem(LocalStorageEnum.REFRESH_TOKEN);
    localStorage.removeItem(LocalStorageEnum.INFO_MODEL_SUBSCRIPTION);
    localStorage.removeItem(LocalStorageEnum.CART);
    this.router.navigateByUrl(`/${UrlPagesEnum.LOGIN}`);
  }
}
