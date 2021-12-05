import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { ComprasService } from '../../../services/compras.service';

import { environment } from '../../../../environments/environment';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-listar-compras',
  templateUrl: './listar-compras.component.html',
})
export class ListarComprasComponent implements OnInit {
  public url = environment.url;
  public compras: any[] = [];
  public siguiente: string = '';
  public anterior: string = '';
  public isLoading: boolean = false;
  public isError: boolean = false;
  public urlActual: string = '';

  public formularioBuscar: FormGroup;

  //mostrar factura
  public isVisible = false;
  public modalFactura = {
    nombre_proveedor: '',
    numero_factura: '',
    id_detalle_factura_compra: [],
  };

  constructor(
    private router: Router,
    private comprasService: ComprasService,
    private fb: FormBuilder
  ) {
    this.formularioBuscar = this.fb.group({
      termino: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.cargarCompras(`${this.url}/facturas/factura-compra/`);
  }

  limpiarFormulario() {
    this.formularioBuscar.reset({ comprobantes: '' });
  }

  enviarFormulario() {
    this.isError = false;
    if (this.formularioBuscar.valid) {
      const termino = this.formularioBuscar.get('termino')?.value;
      const pagina: string = `${this.url}/facturas/busqueda/?search=${termino}`;
      this.buscarCompras(pagina);
    } else {
      this.cargarCompras(`${this.url}/facturas/factura-compra`);
    }
  }

  buscarCompras(pagina: string) {
    this.isLoading = true;
    this.compras = [];
    this.siguiente = '';
    this.anterior = '';
    this.comprasService.getCompras(pagina).subscribe(
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
    this.comprasService.getCompras(pagina).subscribe(
      (data) => {
        console.log('COMPRAS:', data);
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

  eliminarCompra(numero_factura: string, id: number) {
    let titulo = `Eliminar Factura de Compra !!!`;
    let message = `¿Está seguro de eliminar la factura de compra Nro. ${numero_factura}? `;
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
          this.comprasService.deleteCompra(id).subscribe(
            (resp: any) => {
              if (this.urlActual != `${this.url}/facturas/facturas-compra/`) {
                if (this.compras.length > 1) {
                  this.cargarCompras(`${this.urlActual}`);
                } else {
                  this.cargarCompras(`${this.anterior}`);
                }
              } else {
                this.cargarCompras(`${this.url}/facturas/factura-compra/`);
              }

              swalWithBootstrapButtons.fire(
                'Eliminado!!!',
                'La factura de compra fue eliminado con éxito!!!',
                'success'
              );
            },
            (err: any) => {
              swalWithBootstrapButtons.fire(
                'ERROR!!!',
                'La factura de compra no fue eliminado.',
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
            'La factura de compra no fue eliminado.',
            'error'
          );
        }
      });
  }
  showModal(id: number): void {
    this.comprasService.getCompra(id).subscribe((data) => {
      console.log(data);
      this.modalFactura = data;
      this.isVisible = true;
    });
  }
  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  crearNotaCredito(id: number) {
    this.router.navigate(['compras', 'crear-nota-credito-compra', id]);
  }
}
