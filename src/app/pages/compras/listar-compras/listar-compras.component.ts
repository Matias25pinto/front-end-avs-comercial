import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { ProveedoresService } from '../../../services/proveedores.service';
import { Proveedor } from '../../../models/proveedor.interface';

import { environment } from '../../../../environments/environment';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-listar-compras',
  templateUrl: './listar-compras.component.html',
})
export class ListarComprasComponent implements OnInit {
  public url = environment.url;
  public compras: any[] = [
    { id_compra: 1, proveedor: 'Matias Pinto', ruc: '3984969-4' },
    { id_compra: 2, proveedor: 'Matias2 Pinto2', ruc: '3984969-4' },
  ];
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
      comprobantes: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.cargarCompras(`${this.url}/proveedores/`);
  }

  limpiarFormulario() {
    this.formularioBuscar.reset({ comprobantes: '' });
  }

  enviarFormulario() {
    this.isError = false;
    if (this.formularioBuscar.valid) {
      const termino = this.formularioBuscar.get('proveedor')?.value;
      const pagina: string = `${this.url}/proveedores/busqueda/?search=${termino}`;
      this.buscarCompras(pagina);
    } else {
      this.cargarCompras(`${this.url}/proveedores/`);
    }
  }

  buscarCompras(pagina: string) {
    this.isLoading = true;
    this.compras = [];
    this.siguiente = '';
    this.anterior = '';
    this.proveedoresService.getProveedores(pagina).subscribe(
      (data) => {
        this.compras = data.results;
        this.siguiente = data.next != null ? data.next : '';
        this.anterior = data.previous != null ? data.previous.toString() : '';
        this.urlActual = pagina;
        this.isLoading = false;
        if (this.compras.length === 0) {
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

  cargarCompras(pagina: string) {
    this.isLoading = true;
    this.compras = [];
    this.siguiente = '';
    this.anterior = '';
    this.proveedoresService.getProveedores(pagina).subscribe(
      (data) => {
        this.compras = data.results;
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

  modificarCompras(id: number) {
    this.router.navigate(['compras', 'editar-proveedor', id]);
  }

  eliminarCompra(comprobante: string, id: number) {
    let titulo = `Eliminar Comprobante !!!`;
    let message = `¿Está seguro de eliminar el comprobante ? `;
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
          this.proveedoresService
            .deleteProveedor(`${this.url}/proveedores/${id}/`)
            .subscribe(
              (resp: any) => {
                if (this.urlActual != `${this.url}/proveedores/`) {
                  if (this.compras.length > 1) {
                    this.cargarCompras(`${this.urlActual}`);
                  } else {
                    this.cargarCompras(`${this.anterior}`);
                  }
                } else {
                  this.cargarCompras(`${this.url}/proveedores/`);
                }

                swalWithBootstrapButtons.fire(
                  'Eliminado!!!',
                  'El comprobante fue eliminado con éxito!!!',
                  'success'
                );
              },
              (err: any) => {
                swalWithBootstrapButtons.fire(
                  'ERROR!!!',
                  'El comprobante no fue eliminado.',
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
            'El comprobante no fue eliminado.',
            'error'
          );
        }
      });
  }
}
