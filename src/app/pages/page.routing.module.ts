import { Error404Component } from './main-page/error404/error404.component';
import { MainPageComponent } from './main-page/main-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { UrlPagesEnum } from '../enum/urlPagesEnum';

const routes: Routes = [
  {
    path: UrlPagesEnum.LOGIN,
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: UrlPagesEnum.REGISTER,
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: UrlPagesEnum.FORGOT_PASSWORD,
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
        path: UrlPagesEnum.HOME,
        loadChildren: () =>
          import('./main-page/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: UrlPagesEnum.CATEGORIES,
        loadChildren: () =>
          import('./main-page/categories/categories.module').then(
            (m) => m.CategoriesModule
          ),
      },
      {
        path: `${UrlPagesEnum.MODEL}/:url`,
        loadChildren: () =>
          import('./main-page/model/model.module').then((m) => m.ModelModule),
      },
      {
        path: UrlPagesEnum.USER,
        loadChildren: () =>
          import('./main-page/user/user.module').then((m) => m.UserModule),
      },
      {
        path: `${UrlPagesEnum.RIFA}/:id`,
        loadChildren: () =>
          import('./main-page/list-cupos/list-cupos.module').then(
            (m) => m.ListCuposModule
          ),
      },
      {
        path: UrlPagesEnum.CHECKOUT,
        loadChildren: () =>
          import('./main-page/checkout/checkout.module').then(
            (m) => m.CheckoutModule
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
