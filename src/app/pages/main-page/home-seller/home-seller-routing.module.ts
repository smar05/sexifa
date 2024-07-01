import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeSellerComponent } from './home-seller.component';

const routes: Routes = [
  {
    path: '',
    component: HomeSellerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeSellerRoutingModule {}
