import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  getJugador(){
    return this.firestore.collection("Jugadores").snapshotChanges();
  }

  createJugador(Jugador:any){
    return this.firestore.collection("Jugadores").add(Jugador);
  }

  updateJugador(id:any, Jugador:any){
    return this.firestore.collection("Jugadores").doc(id).update(Jugador);
  }

  deleteJugador(id:any){
    return this.firestore.collection("Jugadores").doc(id).delete();
  }
}
