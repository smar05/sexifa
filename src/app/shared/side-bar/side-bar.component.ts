import { Component, OnInit } from '@angular/core';
import { LocalStorageEnum } from 'src/app/enum/localStorageEnum';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  public userType: string = '';

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.userType = localStorage.getItem(LocalStorageEnum.USER_TYPE) || '';
  }

  //Funcion de salida del sistema
  public logout(): void {
    this.loginService.logout();
  }
}
