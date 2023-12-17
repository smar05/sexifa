import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from './../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { ApiInterceptor } from './interceptor/api.interceptor';
import { NgModule, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire/compat';
import { FirestoreModule } from '@angular/fire/firestore';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

//Modulos personalizados
import { PagesModule } from './pages/pages.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    HttpClientModule,
    //FontAwesomeModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
