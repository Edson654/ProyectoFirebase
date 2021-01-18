import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseServiceService } from '../services/firebase-service.service';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  

  closeResult = '';

  JugadorForm: FormGroup;

  idFirebaseActualizar: string;
  actualizar: boolean;

  constructor(private modalService: NgbModal,
              public fb: FormBuilder,
              private firebaseServiceService: FirebaseServiceService
    ) {}

  config: any;
  collection = { count: 20, data: []}

  ngOnInit(): void {

    this.idFirebaseActualizar = "";
    this.actualizar = false;

    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.collection.count
    };

    this.JugadorForm = this.fb.group({
      id: ['', Validators.required],
      nombre: ['', Validators.required],
      apodo: ['', Validators.required],
      dorsal: ['', Validators.required],
      posicion: ['', Validators.required]
    });

    this.firebaseServiceService.getJugador().subscribe(resp => {
      this.collection.data = resp.map((e: any) => {
        return{
        id: e.payload.doc.data().id,
        nombre: e.payload.doc.data().nombre,
        apodo: e.payload.doc.data().apodo,
        dorsal: e.payload.doc.data().dorsal,
        posicion: e.payload.doc.data().posicion,
        idFirebase: e.payload.doc.id
        }
      })
    },
    error => {
      console.error(error);
    }
   );
  }

  pageChanged(event){
    this.config.currentPage = event;
  }

  eliminar(item:any):void{
    this.firebaseServiceService.deleteJugador(item.idFirebase);
  }

  guardarJugador():void {
    this.firebaseServiceService.createJugador(this.JugadorForm.value).then(resp => {
      this.JugadorForm.reset();
      this.modalService.dismissAll();
    }).catch(error =>{
      console.error(error)
    })
    
  }


  actualizarJugador (){

    if(!isNullOrUndefined(this.idFirebaseActualizar)){
    this.firebaseServiceService.updateJugador(this.idFirebaseActualizar, this.JugadorForm.value).then(resp => {
      this.JugadorForm.reset();
      this.modalService.dismissAll();
    }).catch(error => {
      console.error(error);
    });
  }
}

  openEditar(content, item:any) {

    this.JugadorForm.setValue({
      id: item.id,
      nombre: item.nombre,
      apodo: item.apodo,
      dorsal: item.dorsal,
      posicion: item.posicion
    });
    this.idFirebaseActualizar = item.idFirebase;
    this.actualizar = true;


    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  open(content) {
    this.actualizar = false;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
  



