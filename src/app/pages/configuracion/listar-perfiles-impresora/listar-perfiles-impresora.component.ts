import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { ConfiguracionService } from '../../../services/configuracion.service';
import { PerfilImpresora } from '../../../models/configuracion.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-listar-perfiles-impresora',
  templateUrl: './listar-perfiles-impresora.component.html',
  styleUrls: ['./listar-perfiles-impresora.component.css'],
})
export class ListarPerfilesImpresoraComponent implements OnInit {
  public url = environment.url;
  public perfilesImpresora: PerfilImpresora[] = [];
  public siguiente: string = '';
  public anterior: string = '';
  public isLoading: boolean = false;
  public isError: boolean = false;
  public urlActual: string = '';

  public formularioBuscar: FormGroup;

  constructor(
    private router: Router,
    private configuracionService: ConfiguracionService,
    private fb: FormBuilder
  ) {
    this.formularioBuscar = this.fb.group({
      impresora: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarPerfilesImpresora(`${this.url}/configuracion/configuracion/`);
  }

  limpiarFormulario() {
    this.formularioBuscar.reset({ impresora: '' });
  }

  enviarFormulario() {
    this.isError = false;
    if (this.formularioBuscar.valid) {
      const termino = this.formularioBuscar.get('impresora')?.value;
      const pagina: string = `${this.url}/configuracion/busqueda/?search=${termino}`;
      this.buscarPerfilesImpresora(pagina);
    } else {
      this.cargarPerfilesImpresora(`${this.url}/configuracion/configuracion/`);
    }
  }

  buscarPerfilesImpresora(pagina: string) {
    this.isLoading = true;
    this.perfilesImpresora = [];
    this.siguiente = '';
    this.anterior = '';
    this.configuracionService.getPerfilesImpresora(pagina).subscribe(
      (data) => {
        this.perfilesImpresora = data.results;
        this.siguiente = data.next != null ? data.next : '';
        this.anterior = data.previous != null ? data.previous.toString() : '';
        this.urlActual = pagina;
        this.isLoading = false;
        if (this.perfilesImpresora.length === 0) {
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

  cargarPerfilesImpresora(pagina: string) {
    this.isLoading = true;
    this.perfilesImpresora = [];
    this.siguiente = '';
    this.anterior = '';
    this.configuracionService.getPerfilesImpresora(pagina).subscribe(
      (data) => {
        this.perfilesImpresora = data.results;
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

  modificarPerfilImpresora(id: number) {
    this.router.navigate(['configuracion', 'modificar-perfil-impresora', id]);
  }

  eliminarPerfilImpresora(impresora: string, id: number) {
    let titulo = `Eliminar Impresora !!!`;
    let message = `¿Está seguro de eliminar la impresora ${impresora}? `;
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
        confirmButtonText: 'Si, para eliminar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.configuracionService
            .deletePerfilImpresora(`${this.url}/configuracion/configuracion/${id}/`)
            .subscribe(
              (resp: any) => {
                if (this.urlActual != `${this.url}/configuracion/configuracion/`) {
                  if (this.perfilesImpresora.length > 1) {
                    this.cargarPerfilesImpresora(`${this.urlActual}`);
                  } else {
                    this.cargarPerfilesImpresora(`${this.anterior}`);
                  }
                } else {
                  this.cargarPerfilesImpresora(`${this.url}/configuracion/configuracion/`);
                }

                swalWithBootstrapButtons.fire(
                  'Eliminado!!!',
                  'El perfil de impresora fue eliminado con éxito!!!',
                  'success'
                );
              },
              (err: any) => {
                swalWithBootstrapButtons.fire(
                  'ERROR!!!',
                  'El perfil de impresora no fue eliminado.',
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
            'El artículo no fue eliminado.',
            'error'
          );
        }
      });
  }
}
