import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageSellerComponent } from './page-seller.component';

const routes: Routes = [
  {
    path: '',
    component: PageSellerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageSellerRoutingModule {}
