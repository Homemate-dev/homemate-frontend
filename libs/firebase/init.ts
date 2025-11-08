// app/libs/firebase/init.ts
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyBIf_Wo8bx-mUbUoWn7wpJSEvOMRDPxGcg',
  authDomain: 'homemate-3e3fe.firebaseapp.com',
  projectId: 'homemate-3e3fe',
  storageBucket: 'homemate-3e3fe.firebasestorage.app',
  messagingSenderId: '437684088265',
  appId: '1:437684088265:web:b06b33889e14377bdd4c18',
  measurementId: 'G-VPLLHBT3LR',
}

export const firebaseApp = initializeApp(firebaseConfig)
