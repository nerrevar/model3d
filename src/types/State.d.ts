import { FirebaseApp } from 'firebase/app'
import { FirebaseAuth, User } from 'firebase/auth'
import { FirebaseFirestore } from 'firebase/firestore'
import { FirebaseStorage } from 'firebase/storage'

import { IModel } from './Model'

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
    auth: FirebaseAuth,
    db: FirebaseFirestore,
    storage: FirebaseStorage,
  },
  User: User | null,
  Models: {
    rated: Array<IModel>,
    currentList: Array<IModel>,
  },
}
