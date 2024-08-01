import { Component, OnInit } from '@angular/core';
import { EnumVariablesGlobales } from 'src/app/enum/enum-variables-globales';
import { LoginService } from 'src/app/services/login.service';
import { VariablesGlobalesService } from 'src/app/services/variables-globales.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  public userType: string = '';

  constructor(
    private loginService: LoginService,
    private variablesGlobalesService: VariablesGlobalesService
  ) {}

  ngOnInit(): void {
    this.variablesGlobalesService
      .getVariable(EnumVariablesGlobales.USER_TYPE)
      .subscribe((res: string) => {
        this.userType = res || '';
      });
  }

  //Funcion de salida del sistema
  public logout(): void {
    this.loginService.logout();
  }
}
