import { ModelComponent } from './model.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from '../error404/error404.component';

const routes: Routes = [
  {
    path: ':url',
    component: ModelComponent,
  },
  { path: '**', component: Error404Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModelRoutingModule {}
