import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms'
import * as firebase from 'firebase'

import { Bd } from '../../bd.service'
import { Progresso } from '../../progresso.service'

import { Observable } from 'rxjs/Observable'
import 'rxjs/Rx'
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-incluir-publicacao',
  templateUrl: './incluir-publicacao.component.html',
  styleUrls: ['./incluir-publicacao.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class IncluirPublicacaoComponent implements OnInit {

  public email: string
  private imagem: any

  public progressoPublicacao: string = 'pendente'
  public porcentagemUpload: number

  public formulario: FormGroup = new FormGroup({
    'titulo': new FormControl(null)
  })

  constructor(
    private bd: Bd,
    private progresso: Progresso
  ) { }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.email = user.email
    })
  }

  public publicar(): void {
    this.bd.publicar({
      email: this.email,
      titulo: this.formulario.value.titulo,
      imagem: this.imagem[0]
    })

    let acompanhamentoupload = Observable.interval(1500)
    let continua = new Subject()

    continua.next(true)

    acompanhamentoupload
      .takeUntil(continua)
      .subscribe(() => {    
        // console.log(this.progresso.status)
        // console.log(this.progresso.estado)
        this.progressoPublicacao = 'andamento'
        
        this.porcentagemUpload = Math.round((this.progresso.estado.bytesTransferred / this.progresso.estado.totalBytes ) * 100)

        if (this.progresso.status === 'concluido') {
          this.progressoPublicacao = 'concluido'
          continua.next(false)
        }
      })
  }

  public preparaImagemUpload(event: Event): void {
    this.imagem = (<HTMLInputElement>event.target).files    
  }

}