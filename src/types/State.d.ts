import { FirebaseApp } from 'firebase/app'
import { User } from 'firebase/auth'

export interface IFirebaseConfig {
  apiKey: string,
  authDomain: string,
  projectId: string,
  storageBucket: string,
  messagingSenderId: string,
  appId: string,
}

export interface State {
  imgLogo: string,
  IsAuthorized: boolean,
  Firebase: {
    app: FirebaseApp,
  },
  User: User | null,
}
