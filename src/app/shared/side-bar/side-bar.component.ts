import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

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
    localStorage.removeItem('token');
    localStorage.removeItem('localId');
    localStorage.removeItem('refreshToken');
    this.router.navigateByUrl('/login');
  }
}
