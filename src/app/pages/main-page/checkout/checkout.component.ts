import { Iuser } from './../../../interface/iuser';
import { IQueryParams } from './../../../interface/i-query-params';
import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  public user: Iuser = {};

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUserData();
  }

  public getUserData(): void {
    let params: IQueryParams = {
      orderBy: '"id"',
      equalTo: `"${localStorage.getItem('localId')}"`,
    };
    this.userService.getData(params).subscribe((data: any) => {
      this.user = Object.keys(data).map((a: any) => {
        return data[a];
      })[0];
    });
  }
}
