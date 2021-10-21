import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { ProveedoresService } from '../../../services/proveedores.service';
import { Proveedor } from '../../../models/proveedor.interface';

import { environment } from '../../../../environments/environment';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-listar-proveedores',
  templateUrl: './listar-proveedores.component.html',
})
export class ListarProveedoresComponent implements OnInit {
  public url = environment.url;
  public proveedores: Proveedor[] = [];
  public siguiente: string = '';
  public anterior: string = '';
  public isLoading: boolean = false;
  public isError: boolean = false;
  public urlActual: string = '';

  public formularioBuscar: FormGroup;

  constructor(
    private router: Router,
    private proveedoresService: ProveedoresService,
    private fb: FormBuilder
  ) {
    this.formularioBuscar = this.fb.group({
      proveedor: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarProveedores(`${this.url}/proveedores/`);
  }

  limpiarFormulario() {
    this.formularioBuscar.reset({ proveedor: '' });
  }

  enviarFormulario() {
    this.isError = false;
    if (this.formularioBuscar.valid) {
      const termino = this.formularioBuscar.get('proveedor')?.value;
      const pagina: string = `${this.url}/proveedores/busqueda/?search=${termino}`;
      this.buscarProveedores(pagina);
    } else {
      this.cargarProveedores(`${this.url}/proveedores/`);
    }
  }

  buscarProveedores(pagina: string) {
    this.isLoading = true;
    this.proveedores = [];
    this.siguiente = '';
    this.anterior = '';
    this.proveedoresService.getProveedores(pagina).subscribe(
      (data) => {
        this.proveedores = data.results;
        this.siguiente = data.next != null ? data.next : '';
        this.anterior = data.previous != null ? data.previous.toString() : '';
        this.urlActual = pagina;
        this.isLoading = false;
        if (this.proveedores.length === 0) {
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

  cargarProveedores(pagina: string) {
    this.isLoading = true;
    this.proveedores = [];
    this.siguiente = '';
    this.anterior = '';
    this.proveedoresService.getProveedores(pagina).subscribe(
      (data) => {
        this.proveedores = data.results;
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

  modificarProveedor(id: number) {
    this.router.navigate(['compras', 'editar-proveedor', id]);
  }

  eliminarProveedor(proveedor: string, id: number) {
    let titulo = `Eliminar Proveedor !!!`;
    let message = `¿Está seguro de eliminar al Proveedor ${proveedor}? `;
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
        confirmButtonText: 'Si, para eliminar el proveedor!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.proveedoresService
            .deleteProveedor(`${this.url}/proveedores/${id}/`)
            .subscribe(
              (resp: any) => {
                if (this.urlActual != `${this.url}/proveedores/`) {
                  if (this.proveedores.length > 1) {
                    this.cargarProveedores(`${this.urlActual}`);
                  } else {
                    this.cargarProveedores(`${this.anterior}`);
                  }
                } else {
                  this.cargarProveedores(`${this.url}/proveedores/`);
                }

                swalWithBootstrapButtons.fire(
                  'Eliminado!!!',
                  'El proveedor fue eliminado con éxito!!!',
                  'success'
                );
              },
              (err: any) => {
                swalWithBootstrapButtons.fire(
                  'ERROR!!!',
                  'El proveedor no fue eliminado.',
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
            'El proveedor no fue eliminado.',
            'error'
          );
        }
      });
  }
}
