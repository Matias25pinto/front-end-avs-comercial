import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComprasService } from '../../../services/compras.service';
import { ProveedoresService } from '../../../services/proveedores.service';

// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

//PDFmake en TypeScript
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

interface Grilla {
  id_articulo: number;
  nombre: string;
  codigo_barras: string;
  precio: number;
  cantidad: number;
  porc_iva: number;
}

@Component({
  selector: 'app-crear-nota-credito-proveedor',
  templateUrl: './crear-nota-credito-proveedor.component.html',
})
export class CrearNotaCreditoProveedorComponent implements OnInit {
  public idCompra: number;
  public isModal = false;
  public isLoadingCliente = false;
  public proveedores: any[] = [];
  public proveedor: any = {};
  public idProveedor: number;
  public compra: any;
  public articulos: any[] = [];
  public grilla: any[] = [];
  public totalCompra: number = 0;
  public iva10: number = 0;
  public iva5: number = 0;
  public exenta: number = 0;
  public formularioGrilla: FormGroup;

  public isVisible = false;
  public linkPdf: string = '';
  public isLoadingIframe: boolean = false;
  public articulosDetalleCompra: any[] = [];

  constructor(
    private fb: FormBuilder,
    private comprasService: ComprasService,
    private proveedoresService: ProveedoresService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      this.idCompra = params.id;
      this.cargarCompra();
    });
    this.formularioGrilla = this.fb.group({
      codigo: ['', [Validators.required]],
      cantidad: [1, [Validators.required]],
    });
  }

  ngOnInit(): void {}
  ngAfterViewChecked(): void {
    //this.imprimirIframe();
  }
  cargarCompra() {
    this.comprasService.getCompra(this.idCompra).subscribe((compra) => {
      this.compra = compra;
      this.articulosDetalleCompra = compra.id_detalle_factura_compra;
      this.idProveedor = compra.id_proveedor;
      this.cargarProveedores();
    });
  }
  cargarProveedores() {
    this.proveedoresService.getProveedoresLista().subscribe((resp) => {
      this.proveedores = resp;
      this.proveedor = resp.find((proveedor) => {
        return proveedor.id_proveedor == this.idProveedor;
      });
    });
  }
  agregarGrilla(codigo: string, cantidadString: string) {
    if (this.totalCompra >= this.compra.total) {
      this.limpiarFormularioGrilla();
      return;
    }
    if (this.compra.total_nota_credito == this.compra.total) {
      this.limpiarFormularioGrilla();
      return;
    }

    let articuloDetalleCompra = this.articulosDetalleCompra.find((articulo) => {
      if (articulo.codigo_articulo == codigo) {
        return articulo;
      }
    });
    let articulo = undefined;
    if (articuloDetalleCompra) {
      articulo = articuloDetalleCompra;
    }
    if (articulo) {
      let precio = 0;
      let viejoArticulo = this.grilla.find((articulo) => {
        if (articulo.codigo_barras == codigo) {
          return articulo;
        }
      });
      let cantidad = viejoArticulo
        ? viejoArticulo.cantidad + parseInt(cantidadString)
        : parseInt(cantidadString);
      if (cantidad > articuloDetalleCompra.cantidad) {
        this.limpiarFormularioGrilla();
        return;
      }
      precio = articuloDetalleCompra.costo_unitario;
      console.log('articulo', articulo);
      let articuloGrilla: Grilla = {
        id_articulo: articulo.id_articulo,
        nombre: articulo.nombre_articulo,
        codigo_barras: articulo.codigo_articulo,
        precio,
        cantidad,
        porc_iva: articulo.iva,
      };
      let result = this.grilla;
      if (viejoArticulo) {
        result = this.grilla.filter((articulo) => {
          if (articulo.codigo_barras != codigo) {
            return articulo;
          }
        });
      }

      this.grilla = [articuloGrilla, ...result];
      this.actualizarPanel();
      this.limpiarFormularioGrilla();
    }
  }
  actualizarPanel() {
    this.totalCompra = 0;
    this.iva10 = 0;
    this.grilla.map((articulo) => {
      this.totalCompra = this.totalCompra + articulo.precio * articulo.cantidad;
      if (articulo.porc_iva == 10) {
        this.iva10 = this.iva10 + (articulo.precio * articulo.cantidad) / 11;
      }
      if (articulo.porc_iva == 5) {
        this.iva5 = this.iva5 + (articulo.precio * articulo.cantidad) / 21;
      }
      if (articulo.porc_iva == 0) {
        this.exenta = this.exenta + articulo.precio * articulo.cantidad;
      }
    });
  }

  enviarFormularioGrilla() {
    if (this.formularioGrilla.valid) {
      const codigo = this.formularioGrilla.get('codigo')?.value;
      const cantidad = this.formularioGrilla.get('cantidad')?.value;
      if (codigo != '' && parseInt(cantidad) > 0) {
        this.agregarGrilla(codigo, cantidad);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo código del artículo y la cantidad son obligatorios',
        footer: '<p>Verificar el campo código y el campo cantidad</p>',
      });
    }
  }

  eliminarGrilla(id_articulo: number) {
    let articulo = this.grilla.find((articulo) => {
      if (articulo.id_articulo == id_articulo) {
        return articulo;
      }
    });
    let titulo = `Eliminar Artículo!!!`;
    let message = `¿Está seguro de eliminar el artículo ${articulo.nombre}? `;
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
        confirmButtonText: 'Si, para eliminar el artículo',
        cancelButtonText: 'No, para cancelar!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          let articulos = this.grilla.filter((articulo) => {
            if (articulo.id_articulo != id_articulo) {
              return articulo;
            }
          });
          this.grilla = [...articulos];
          this.actualizarPanel();
          swalWithBootstrapButtons.fire(
            'Eliminado!!!',
            `El artículo fue eliminado con éxito!!!`,
            'success'
          );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado!!!',
            `El artículo no fue eliminado.`,
            'error'
          );
        }
      });
  }
  limpiarNotaCredito() {
    this.grilla = [];
    this.totalCompra = 0;
    this.iva10 = 0;
    this.iva5 = 0;
    this.exenta = 0;
  }
  limpiarFormularioGrilla() {
    this.formularioGrilla.reset({ codigo: '', cantidad: 1 });
  }
  enviarFormularioNotaCredito() {
    if (this.totalCompra <= this.compra.total) {
      let detalleCompra: any[] = this.grilla.map((articulo) => {
        let detalle: any = {
          id_articulo: articulo.id_articulo,
          cantidad: articulo.cantidad,
          costo_unitario: articulo.precio,
          sub_total: articulo.cantidad * articulo.precio,
        };
        return detalle;
      });

      let body: any = {
        id_detalle_nota_credito_proveedor: detalleCompra,
        id_factura_compra: this.idCompra,
        monto_total: this.totalCompra,
      };
      this.comprasService.crearNotaCredito(body).subscribe(
        (resp) => {
          console.log('resp', resp);
          this.limpiarFormularioGrilla();
          this.grilla = [];
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'La Nota de Crédito fue agregado exitosamente.',
            showConfirmButton: false,
            timer: 1500,
          });
          this.cargarCompra();
        },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo agregar la Nota de Crédito',
            text: 'Verificar su conexión a internet',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'La nota de crédito no puede ser superior al monto de la venta',
        footer: '<p>Verificar el campo código y el campo cantidad</p>',
      });
    }
  }
}
