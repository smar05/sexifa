import { UrlPagesEnum } from 'src/app/enum/urlPagesEnum';

const apiKey: string = 'AIzaSyBoulcYFTuxoou3_vBztY0TWBvhcemg4n8';
const apiKeyLocation: string =
  'dU1Pc1lYSnBVZDVqcVpSYjhVSkswTGhWTWlRWVZaUHpIdFBuemhINA==';
const apiKeyCurrencyConverter: string =
  'b1a887ecd831283337100ac9f2cee83a4baaae56';
const urlProd: string = 'http://localhost:4200';
const urlServidorLocal: string = 'http://localhost:8080';

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
  production: true,
  urlFirebase: `https://sexifa-269bf-default-rtdb.firebaseio.com/`,
  urlLogin: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
  urlGetUser: `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
  urlLocation: `https://api.countrystatecity.in/v1/`,
  urlCurrencyConverter: `https://api.getgeoapi.com`,
  urlProd,
  urlServidorLocal,
  urlCollections: {
    categories: 'categories',
    models: 'models',
    users: 'users',
    subscriptions: 'subscriptions',
    orders: 'orders',
    views_model: 'views_model',
    front_logs: 'front_logs',
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
    responseUrl: `${urlProd}/${UrlPagesEnum.CHECKOUT}`,
    confirmationUrl: 'http://www.test.com/confirmation',
    apiKey: '4Vj8eK4rloUd272L48hsrarnUA',
    test: 1,
  },
};
