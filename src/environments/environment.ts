// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { UrlPagesEnum } from 'src/app/enum/urlPagesEnum';

const apiKey: string = 'AIzaSyBoulcYFTuxoou3_vBztY0TWBvhcemg4n8';
const apiKeyLocation: string =
  'dU1Pc1lYSnBVZDVqcVpSYjhVSkswTGhWTWlRWVZaUHpIdFBuemhINA==';
const apiKeyCurrencyConverter: string =
  'b1a887ecd831283337100ac9f2cee83a4baaae56';
const urlProd: string = 'https://sexifa-269bf.web.app/';
const urlServidorLocal: string = 'https://sexifa-back.onrender.com'; //'http://localhost:8080';

const firebaseConfig: any = {
  apiKey: 'AIzaSyBoulcYFTuxoou3_vBztY0TWBvhcemg4n8',
  authDomain: 'sexifa-269bf.firebaseapp.com',
  projectId: 'sexifa-269bf',
  storageBucket: 'sexifa-269bf.appspot.com',
  messagingSenderId: '126829802446',
  appId: '1:126829802446:web:ebc196701d7dded863319f',
  measurementId: 'G-FRCL305Z04',
};

export const environment = {
  production: false,
  urlFirebase: `https://sexifa-269bf-default-rtdb.firebaseio.com/`,
  urlLogin: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
  urlGetUser: `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
  urlLocation: `https://api.countrystatecity.in/v1/`,
  urlCurrencyConverter: `https://api.getgeoapi.com`,
  urlProd,
  urlServidorLocal,
  urlBot: 'https://t.me/OnlyGramGroup_BOT',
  urlBotGetId: 'https://t.me/getidsbot',
  urlCollections: {
    categories: 'categories',
    models: 'models',
    users: 'users',
    subscriptions: 'subscriptions',
    orders: 'orders',
    views_model: 'views_model',
    front_logs: 'front_logs',
    business_params: 'business_params',
    saldos: 'saldos',
    metodos_de_pago: 'metodos_de_pago',
  },
  urlsServidor: {
    urlTelegramApi: 'telegram',
    urlModelsApi: 'models',
  },
  urlRefreshToken: `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
  firebaseConfig,
  apiKeyLocation,
  apiKeyCurrencyConverter,
  payUCredentials: {
    merchantId: '508029',
    action: 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/',
    accountId: {
      col: '512321',
    },
    responseUrl: `${urlProd}/#/${UrlPagesEnum.CHECKOUT}`,
    confirmationUrl: 'http://www.test.com/confirmation',
    apiKey: '4Vj8eK4rloUd272L48hsrarnUA',
    test: 1,
  },
  urlRedes: {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    x: 'https://twitter.com/',
    tiktok: 'https://www.tiktok.com/@',
    threads: 'https://www.threads.net/@',
  },
  epayco: {
    key: '3ee3536f1a43c9102dd1f97b491a1a4d',
    app_id: '1462767',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
