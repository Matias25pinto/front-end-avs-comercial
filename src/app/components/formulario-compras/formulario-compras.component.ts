import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProveedoresService } from '../../services/proveedores.service';
import { ArticulosService } from '../../services/articulos.service';
import { ComprasService } from '../../services/compras.service';
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
  costo_unitario: number;
  cantidad: number;
  unidad_medida: number;
  porc_iva: number;
}

@Component({
  selector: 'app-formulario-compras',
  templateUrl: './formulario-compras.component.html',
})
export class FormularioComprasComponent implements OnInit {
  @Input() isCreateCompra: boolean;
  public isModal = false;
  public isLoadingCliente = false;
  public proveedores: any[] = [];
  public articulos: any[] = [];
  public grilla: any[] = [];
  public totalCompra: number = 0;
  public iva10: number = 0;
  public iva5: number = 0;
  public exenta: number = 0;
  public formularioCompra: FormGroup;
  public formularioGrilla: FormGroup;

  public isVisible = false;
  public linkPdf: string = '';
  public isLoadingIframe: boolean = false;

  public vuelto: number = 0;

  constructor(
    private fb: FormBuilder,
    private proveedoresService: ProveedoresService,
    private articulosService: ArticulosService,
    private comprasService: ComprasService
  ) {
    this.formularioCompra = this.fb.group({
      proveedor: ['', [Validators.required]],
      numero_factura: ['', Validators.required],
    });
    this.formularioGrilla = this.fb.group({
      codigo: ['', [Validators.required, Validators.pattern('[0-9]{1,13}$')]],
      cantidad: [1, [Validators.required, Validators.pattern('[0-9]{1,13}$')]],
      costo_unitario: ['', [Validators.required, Validators.pattern('[0-9]{1,13}$')]],
    });
  }

  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarArticulos();
  }
  ngAfterViewChecked(): void {
    //this.imprimirIframe();
  }
  cargarArticulos() {
    this.articulosService.getArticulosLista().subscribe((articulos) => {
      this.articulos = articulos;
    });
  }
  cargarProveedores() {
    this.proveedoresService.getProveedoresLista().subscribe((resp) => {
      this.proveedores = resp;
      console.log(this.proveedores);
    });
  }
  handleKeyDownGrilla(event: any) {
    //keycode de enter es 13
    if (event.keyCode == 13) {
      this.enviarFormularioGrilla();
    }
  }
  agregarGrilla(
    codigo: string,
    cantidadString: string,
    costo_unitario: number
  ) {
    let articulo = this.articulos.find((articulo) => {
      if (articulo.codigo_barras == codigo) {
        return articulo;
      }
    });
    if (articulo) {
      let viejoArticulo = this.grilla.find((articulo) => {
        if (articulo.codigo_barras == codigo) {
          return articulo;
        }
      });
      let cantidad = viejoArticulo
        ? viejoArticulo.cantidad + parseInt(cantidadString)
        : parseInt(cantidadString);

      let articuloGrilla: Grilla = {
        id_articulo: articulo.id_articulo,
        nombre: articulo.nombre,
        codigo_barras: articulo.codigo_barras,
        costo_unitario,
        cantidad,
        unidad_medida: articulo.unidad_medida,
        porc_iva: articulo.porc_iva,
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
      this.totalCompra =
        this.totalCompra + articulo.costo_unitario * articulo.cantidad;
      if (articulo.porc_iva == 10) {
        this.iva10 =
          this.iva10 + (articulo.costo_unitario * articulo.cantidad) / 11;
      }
      if (articulo.porc_iva == 5) {
        this.iva5 =
          this.iva5 + (articulo.costo_unitario * articulo.cantidad) / 21;
      }
      if (articulo.porc_iva == 0) {
        this.exenta = this.exenta + articulo.costo_unitario * articulo.cantidad;
      }
    });
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
  enviarFormularioGrilla() {
    //solo acepta hasta hasta 10 elementos
    if (this.formularioGrilla.valid) {
      const codigo = this.formularioGrilla.get('codigo')?.value;
      const cantidad = this.formularioGrilla.get('cantidad')?.value;
      const costo_unitario = this.formularioGrilla.get('costo_unitario')?.value;
      if (codigo != '' && parseInt(cantidad) > 0) {
        this.agregarGrilla(codigo, cantidad, costo_unitario);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo código del artículo, precio costo y la cantidad son obligatorios',
        footer: '<p>Verificar el campo código y el campo cantidad</p>',
      });
    }
  }
  limpiarFormularioGrilla() {
    this.formularioGrilla.reset({
      codigo: '',
      cantidad: 1,
      costo_unitario: '',
    });
  }
  limpiarFormularioCompra() {
    this.formularioCompra.reset({
      proveedor: '',
      numero_factura: '',
    });
    this.grilla = [];
    this.totalCompra = 0;
    this.iva10 = 0;
    this.iva5 = 0;
    this.exenta = 0;
  }
  enviarFormularioCompra() {
    if (this.formularioCompra.valid && this.totalCompra > 0) {
      const id_proveedor = this.formularioCompra.get('proveedor')?.value;
      const numero_factura = this.formularioCompra.get('numero_factura')?.value;
      if (true) {
        let detalleCompra: any[] = this.grilla.map((articulo) => {
          let detalle: any = {
            costo_unitario: articulo.costo_unitario,
            sub_total: articulo.cantidad * articulo.costo_unitario,
            id_articulo: articulo.id_articulo,
            cantidad: articulo.cantidad,
          };
          return detalle;
        });

        let body: any = {
          id_detalle_factura_compra: detalleCompra,
          id_compra: 0,
          total: this.totalCompra,
          id_proveedor: id_proveedor,
          numero_factura,
        };
	console.log("body",body);

        this.comprasService.crearCompra(body).subscribe(
          (resp) => {
            console.log("resp",resp);
            this.limpiarFormularioGrilla();
            this.limpiarFormularioCompra();
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'La factura fue agregado exitosamente.',
              showConfirmButton: false,
              timer: 1500,
            });
          },
          (err) => {
            Swal.fire({
              icon: 'error',
              title: 'No se pudo cargar la factura de compra',
              text: 'Verificar su conexión a internet',
            });
          }
        );
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo proveedor y el número de factura son obligatorios',
        footer: '<p>Verificar el campo cliente y el campo importe</p>',
      });
    }
  }
  formatearMoneda(monto: number) {
    return monto.toLocaleString('es-PY', {
      minimumFractionDigits: 0,
    });
  }
}
