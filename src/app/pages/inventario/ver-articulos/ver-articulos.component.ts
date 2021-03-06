import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { ArticulosService } from '../../../services/articulos.service';
import { Articulo } from '../../../models/articulo.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-ver-articulos',
  templateUrl: './ver-articulos.component.html',
})
export class VerArticulosComponent implements OnInit {
  public url = environment.url;
  public articulos: Articulo[] = [];
  public siguiente: string = '';
  public anterior: string = '';
  public isLoading: boolean = false;
  public isError: boolean = false;
  public urlActual: string = '';

  public formularioBuscar: FormGroup;

  constructor(
    private router: Router,
    private articulosService: ArticulosService,
    private fb: FormBuilder
  ) {
    this.formularioBuscar = this.fb.group({
      articulo: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarArticulos(`${this.url}/articulos/`);
  }

  limpiarFormulario() {
    this.formularioBuscar.reset({ articulo: '' });
  }

  enviarFormulario() {
    this.isError = false;
    if (this.formularioBuscar.valid) {
      const termino = this.formularioBuscar.get('articulo')?.value;
      const pagina: string = `${this.url}/articulos/busqueda/?search=${termino}`;
      this.buscarArticulos(pagina);
    } else {
      this.cargarArticulos(`${this.url}/articulos/`);
    }
  }

  buscarArticulos(pagina: string) {
    this.isLoading = true;
    this.articulos = [];
    this.siguiente = '';
    this.anterior = '';
    this.articulosService.getArticulos(pagina).subscribe(
      (data) => {
        this.articulos = data.results;
        this.siguiente = data.next != null ? data.next : '';
        this.anterior = data.previous != null ? data.previous.toString() : '';
        this.urlActual = pagina;
        this.isLoading = false;
        if (this.articulos.length === 0) {
          this.isError = true;
        }
      },
      (err) => {
        this.urlActual = pagina;
        this.isLoading = false;
        this.isError = true;
        console.warn(err);
      }
    );
  }

  cargarArticulos(pagina: string) {
    this.isLoading = true;
    this.articulos = [];
    this.siguiente = '';
    this.anterior = '';
    this.articulosService.getArticulos(pagina).subscribe(
      (data) => {
        this.articulos = data.results;
        this.siguiente = data.next != null ? data.next : '';
        this.anterior = data.previous != null ? data.previous.toString() : '';
        this.urlActual = pagina;
        this.isLoading = false;
      },
      (err) => {
        this.urlActual = pagina;
        this.isLoading = false;
        this.isError = true;
        console.warn(err);
      }
    );
  }

  modificarArticulo(id: number) {
    this.router.navigate(['inventario', 'modificar-articulo', id]);
  }
  ajustarStock(id: number) {
    this.router.navigate(['inventario', 'ajustar-stock-articulo', id]);
  }

  eliminarArticulo(articulo: string, id: number) {
    let titulo = `Eliminar Art??culo !!!`;
    let message = `??Est?? seguro de eliminar el art??culo ${articulo}? `;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: titulo,
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, para eliminar el art??culo!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.articulosService
            .deleteArticulo(`${this.url}/articulos/${id}/`)
            .subscribe(
              (resp: any) => {
                if (this.urlActual != `${this.url}/articulos/`) {
                  if (this.articulos.length > 1) {
                    this.cargarArticulos(`${this.urlActual}`);
                  } else {
                    this.cargarArticulos(`${this.anterior}`);
                  }
                } else {
                  this.cargarArticulos(`${this.url}/articulos/`);
                }

                swalWithBootstrapButtons.fire(
                  'Eliminado!!!',
                  'El art??culo fue eliminado con ??xito!!!',
                  'success'
                );
              },
              (err: any) => {
                swalWithBootstrapButtons.fire(
                  'ERROR!!!',
                  'El art??culo no fue eliminado.',
                  'error'
                );
              }
            );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado!!!',
            'El art??culo no fue eliminado.',
            'error'
          );
        }
      });
  }
}
