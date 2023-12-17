import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSellerComponent } from './user-seller.component';

const routes: Routes = [
  {
    path: '',
    component: UserSellerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSellerRoutingModule {}
