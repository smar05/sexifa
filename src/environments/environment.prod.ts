const apiKey: string = 'AIzaSyBoulcYFTuxoou3_vBztY0TWBvhcemg4n8';
const apiKeyLocation: string =
  'dU1Pc1lYSnBVZDVqcVpSYjhVSkswTGhWTWlRWVZaUHpIdFBuemhINA==';

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
  urlCollections: {
    categories: 'categories',
    models: 'models',
    pages: 'pages',
    users: 'users',
  },
  urlRefreshToken: `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
  firebaseConfig,
  apiKeyLocation,
};
