import { Error404Component } from './main-page/error404/error404.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordModule
      ),
  },
  {
    path: '',
    component: MainPageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./main-page/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./main-page/categories/categories.module').then(
            (m) => m.CategoriesModule
          ),
      },
      {
        path: 'model/:url',
        loadChildren: () =>
          import('./main-page/model/model.module').then((m) => m.ModelModule),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('./main-page/user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'list-cupos',
        loadChildren: () =>
          import('./main-page/list-cupos/list-cupos.module').then(
            (m) => m.ListCuposModule
          ),
      },
      { path: '**', component: Error404Component },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule {}
