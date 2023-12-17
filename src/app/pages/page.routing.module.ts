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
        path: `${UrlPagesEnum.GROUP}`,
        loadChildren: () =>
          import('./main-page/model/model.module').then((m) => m.ModelModule),
      },
      {
        path: UrlPagesEnum.USER,
        loadChildren: () =>
          import('./main-page/user/user.module').then((m) => m.UserModule),
      },
      {
        path: UrlPagesEnum.CHECKOUT,
        loadChildren: () =>
          import('./main-page/checkout/checkout.module').then(
            (m) => m.CheckoutModule
          ),
      },
      //Seller
      {
        path: UrlPagesEnum.HOME_SELLER,
        loadChildren: () =>
          import('./main-page/home-seller/home-seller.module').then(
            (m) => m.HomeSellerModule
          ),
      },
      {
        path: UrlPagesEnum.USER_SELLER,
        loadChildren: () =>
          import('./main-page/user-seller/user-seller.module').then(
            (m) => m.UserSellerModule
          ),
      },
      {
        path: UrlPagesEnum.PAGE_SELLER,
        loadChildren: () =>
          import('./main-page/page-seller/page-seller.module').then(
            (m) => m.PageSellerModule
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
