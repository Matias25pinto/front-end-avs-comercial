import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComprasService } from '../../../services/compras.service';
import { ProveedoresService } from '../../../services/proveedores.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';
//PDFmake en TypeScript
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-listar-notas-credito-proveedor',
  templateUrl: './listar-notas-credito-proveedor.component.html',
})
export class ListarNotasCreditoProveedorComponent implements OnInit {
  public url = environment.url;
  public notasCredito: any[] = [];
  public siguiente: string = '';
  public anterior: string = '';
  public isLoading: boolean = false;
  public isError: boolean = false;
  public urlActual: string = '';

  public formularioBuscar: FormGroup;

  //mostrar factura
  public isVisible = false;
  public proveedores: any[] = [];
  public articulos: any[] = [];
  public idCliente: number;
  public proveedor: any;
  public modalNotaCredito = {
    nombre_proveedor: '',
    numero_factura: '',
    id_detalle_nota_credito_proveedor: [],
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private comprasService: ComprasService,
    private proveedoresService: ProveedoresService
  ) {
    this.formularioBuscar = this.fb.group({
      notaCredito: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarNotasCredito(`${this.url}/nota-credito/nota-credito-proveedor/`);
  }
  limpiarFormulario() {
    this.formularioBuscar.reset({ notaCredito: '' });
  }

  enviarFormulario() {
    this.isError = false;
    if (this.formularioBuscar.valid) {
      const termino = this.formularioBuscar.get('notaCredito')?.value;
      const pagina: string = `${this.url}/nota-credito/busqueda-nota-credito-proveedor/?search=${termino}`;
      this.buscarNotaCredito(pagina);
    } else {
      this.cargarNotasCredito(
        `${this.url}/nota-credito/nota-credito-proveedor/`
      );
    }
  }

  buscarNotaCredito(pagina: string) {
    this.isLoading = true;
    this.notasCredito = [];
    this.siguiente = '';
    this.anterior = '';
    this.comprasService.getNotasCredito(pagina).subscribe(
      (data) => {
        this.notasCredito = data.results;
        this.siguiente = data.next != null ? data.next : '';
        this.anterior = data.previous != null ? data.previous.toString() : '';
        this.urlActual = pagina;
        this.isLoading = false;
        if (this.notasCredito.length === 0) {
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
  cargarNotasCredito(pagina: string) {
    this.isLoading = true;
    this.notasCredito = [];
    this.siguiente = '';
    this.anterior = '';
    this.comprasService.getNotasCredito(pagina).subscribe(
      (data) => {
        this.notasCredito = data.results;
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
  showModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
  cargarProveedor(id: number) {
    return this.proveedores.find((proveedor) => proveedor.id_persona == id);
  }

  mostrarNotaCredito(id: number) {
    console.log("id:",id);
    this.modalNotaCredito = {
      nombre_proveedor: '',
      numero_factura: '',
      id_detalle_nota_credito_proveedor: [],
    };

    this.modalNotaCredito = this.notasCredito.find(
      (notaCredito) => notaCredito.id_nota_credito_proveedor == id
    );

    console.log(this.modalNotaCredito);
    this.showModal();
  }
  eliminarNotaCreditoProveedor(id:number, numero_factura:string){
let titulo = `Eliminar Nota Crédito de Compra !!!`;
    let message = `¿Está seguro de eliminar la nota de crédito de compra Nro. ${numero_factura}? `;
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
          this.comprasService.deleteNotaCredito(id).subscribe(
            (resp: any) => {
              if (this.urlActual != `${this.url}/nota-credito/nota-credito-proveedor/`) {
                if (this.notasCredito.length > 1) {
                  this.cargarNotasCredito(`${this.urlActual}`);
                } else {
                  this.cargarNotasCredito(`${this.anterior}`);
                }
              } else {
                this.cargarNotasCredito(`${this.url}/nota-credito/nota-credito-proveedor/`);
              }

              swalWithBootstrapButtons.fire(
                'Eliminado!!!',
                'La nota de crédito de compra fue eliminado con éxito!!!',
                'success'
              );
            },
            (err: any) => {
              swalWithBootstrapButtons.fire(
                'ERROR!!!',
                'La nota de crédito de compra no fue eliminado.',
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
            'La nota de crédito de compra no fue eliminado.',
            'error'
          );
        }
      });

  }
}
