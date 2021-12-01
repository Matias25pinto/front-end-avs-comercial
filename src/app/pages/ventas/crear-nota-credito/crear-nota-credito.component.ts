import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PersonaService } from '../../../services/persona.service';
import { Persona } from '../../../models/persona.interface';
import {
  Venta,
  DetalleVenta,
  NotaCredito,
  DetalleNotaCredito,
} from '../../../models/venta.interface';
import { VentasService } from '../../../services/ventas.service';
import { ArticulosService } from '../../../services/articulos.service';

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
  unidad_medida: number;
  tipo_precio: string;
  porc_iva: number;
}

@Component({
  selector: 'app-crear-nota-credito',
  templateUrl: './crear-nota-credito.component.html',
})
export class CrearNotaCreditoComponent implements OnInit {
  public idVenta: number;
  public isModal = false;
  public isLoadingCliente = false;
  public clientes: Persona[] = [];
  public cliente: Persona;
  public idCliente: number;
  public venta: Venta;
  public articulos: any[] = [];
  public grilla: any[] = [];
  public totalVenta: number = 0;
  public iva10: number = 0;
  public iva5: number = 0;
  public exenta: number = 0;
  public formularioGrilla: FormGroup;

  public isVisible = false;
  public linkPdf: string = '';
  public isLoadingIframe: boolean = false;
  public articulosDetalleVenta: any[] = [];

  constructor(
    private fb: FormBuilder,
    private personaService: PersonaService,
    private ventasService: VentasService,
    private articulosService: ArticulosService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      this.idVenta = params.id;
      this.cargarVenta();
    });
    this.formularioGrilla = this.fb.group({
      codigo: ['', [Validators.required]],
      cantidad: [1, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cargarArticulos();
  }
  ngAfterViewChecked(): void {
    //this.imprimirIframe();
  }
  cargarVenta() {
    this.ventasService.getVenta(this.idVenta).subscribe((venta) => {
      this.venta = venta;
      this.articulosDetalleVenta = venta.id_detalle_venta;
      console.log(venta);
      this.idCliente = venta.id_cliente;
      this.cargarClientes();
    });
  }
  cargarClientes() {
    this.personaService.getPersonasLista().subscribe((resp) => {
      console.log(this.idCliente);
      this.cliente = resp.find(
        (persona) => persona.id_persona == this.idCliente
      );
      console.log(resp);
      console.log(this.cliente);
    });
  }
  cargarArticulos() {
    this.articulosService.getArticulosLista().subscribe((articulos) => {
      this.articulos = articulos;
    });
  }
  public handleKeyDownGrilla(event: any) {
    //keycode de enter es 13
    if (event.keyCode == 13) {
      this.enviarFormularioGrilla();
    }
  }
  agregarGrilla(codigo: string, cantidadString: string) {
    if (this.totalVenta >= this.venta.total) {
      this.limpiarFormularioGrilla();
      return;
    }
    let articuloDetalleVenta = this.articulosDetalleVenta.find((articulo) => {
      if (articulo.codigo_articulo == codigo) {
        console.log('articuloDetalleVenta', articulo);
        return articulo;
      }
    });
    let articulo = undefined;
    if (articuloDetalleVenta) {
      console.log(articuloDetalleVenta);
      articulo = this.articulos.find((articulo) => {
        if (articulo.id_articulo == articuloDetalleVenta.id_articulo) {
          return articulo;
        }
      });
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
      let tipo_precio = '';
      if (cantidad > articuloDetalleVenta.cantidad) {
        this.limpiarFormularioGrilla();
        return;
      }
      precio = articuloDetalleVenta.precio_unitario;
      if (articuloDetalleVenta.cantidad < 3) {
        precio = articulo.precio_unitario;
        tipo_precio = 'Unitario';
      } else if (articuloDetalleVenta.cantidad >= 3 && cantidad < 12) {
        precio = articulo.precio_mayorista;
        tipo_precio = 'Mayorista';
      } else if (articuloDetalleVenta.cantidad >= 12) {
        precio = articulo.precio_especial;
        tipo_precio = 'Especial';
      }

      let articuloGrilla: Grilla = {
        id_articulo: articulo.id_articulo,
        nombre: articulo.nombre,
        codigo_barras: articulo.codigo_barras,
        precio,
        cantidad,
        unidad_medida: articulo.unidad_medida,
        tipo_precio,
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
    this.totalVenta = 0;
    this.iva10 = 0;
    this.grilla.map((articulo) => {
      this.totalVenta = this.totalVenta + articulo.precio * articulo.cantidad;
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
  eliminarGrilla(id_articulo: number) {
    let articulo = this.grilla.find((articulo) => {
      if (articulo.id_articulo == id_articulo) {
        return articulo;
      }
    });
    let titulo = `Eliminar Artículo!!!`;
    let message = `¿Está seguro de eliminar el artículo ${articulo.nombre} de la venta? `;
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
    if (this.formularioGrilla.valid && this.grilla.length < 10) {
      const codigo = this.formularioGrilla.get('codigo')?.value;
      const cantidad = this.formularioGrilla.get('cantidad')?.value;
      if (codigo != '' && parseInt(cantidad) > 0) {
        this.agregarGrilla(codigo, cantidad);
      }
    } else {
      if (this.grilla.length >= 10) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'La factura ya esta llena se alcanzo el limite de items',
          footer: '<p>El limite de ítems por factura es de 10</p>',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El campo código del artículo y la cantidad son obligatorios',
          footer: '<p>Verificar el campo código y el campo cantidad</p>',
        });
      }
    }
  }
  limpiarNotaCredito() {
    this.grilla = [];
    this.totalVenta = 0;
    this.iva10 = 0;
    this.iva5 = 0;
    this.exenta = 0;
  }
  limpiarFormularioGrilla() {
    this.formularioGrilla.reset({ codigo: '', cantidad: 1 });
  }
  enviarFormularioNotaCredito() {
    if (this.totalVenta <= this.venta.total) {
      let fecha = new Date();
      let detalleVenta: DetalleNotaCredito[] = this.grilla.map((articulo) => {
        let detalle: DetalleNotaCredito = {
          cantidad: articulo.cantidad,
          id_articulo: articulo.id_articulo,
        };
        return detalle;
      });

      let body: NotaCredito = {
        id_detalle_nota_credito: detalleVenta,
        id_venta: this.idVenta,
        monto_total: this.totalVenta,
      };

      this.ventasService.crearNotaCredito(body).subscribe(
        (resp) => {
          console.log(resp);
          this.limpiarFormularioGrilla();
          this.grilla = [];
          this.mostrarNotaCredito(resp);
        },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: 'No se pudo realizar la Nota de Crédito',
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
  formatearMoneda(monto: number) {
    return monto.toLocaleString('es-PY', {
      minimumFractionDigits: 0,
    });
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
  crearHojaFactura(notaCredito: any, original: boolean) {
    //Crear Grilla
    let detalleVenta: Array<DetalleVenta> = notaCredito.id_detalle_nota_credito;

    let body = [];

    let positionX = parseInt(localStorage.getItem('coordenada_x'));

    let positionY = parseInt(localStorage.getItem('coordenada_y'));
    if (!original) {
      positionX = positionX;
      positionY = positionY + 350;
    }

    let positionYGrilla = positionY + 150;
    let totalExenta = 0;
    let totalIva5 = 0;
    let totalIva10 = 0;
    let totalIva = 0;
    let subTotalExenta = 0;
    let subTotalIva5 = 0;
    let subTotalIva10 = 0;

    for (let articulo of detalleVenta) {
      positionYGrilla = positionYGrilla + 20;
      let exenta = 0;
      let iva10 = 0;
      let iva5 = 0;
      if (articulo.tipo_iva == 10) {
        iva10 = parseInt(
          (articulo.precio_unitario * articulo.cantidad).toString()
        );
        totalIva10 = totalIva10 + parseInt(articulo.sub_total_iva.toString());
        subTotalIva10 = subTotalIva10 + iva10;
        totalIva = totalIva + parseInt(articulo.sub_total_iva.toString());
      }
      if (articulo.tipo_iva == 5) {
        iva5 = parseInt(
          (articulo.precio_unitario * articulo.cantidad).toString()
        );
        totalIva5 = totalIva5 + parseInt(articulo.sub_total_iva.toString());
        subTotalIva5 = subTotalIva5 + iva5;
        totalIva = totalIva + parseInt(articulo.sub_total_iva.toString());
      }
      if (articulo.tipo_iva == 0) {
        exenta = parseInt(
          (articulo.precio_unitario * articulo.cantidad).toString()
        );
        totalExenta = totalExenta + parseInt(articulo.sub_total_iva.toString());
        subTotalExenta = subTotalExenta + exenta;
      }
      let grilla: Array<any> = [
        {
          text: articulo.codigo_articulo,
          style: 'grilla',
          absolutePosition: { x: positionX + 100, y: positionYGrilla },
        },
        {
          text: articulo.cantidad,
          style: 'grilla',
          absolutePosition: { x: positionX + 150, y: positionYGrilla },
        },
        {
          text: `${articulo.nombre_articulo}`,
          style: 'grilla',
          absolutePosition: { x: positionX + 180, y: positionYGrilla },
        },
        {
          text: `${articulo.precio_unitario}`,
          style: 'grilla',
          absolutePosition: { x: positionX + 350, y: positionYGrilla },
        },
        {
          text: `${exenta}`,
          style: 'grilla',
          absolutePosition: { x: positionX + 410, y: positionYGrilla },
        },
        {
          text: `${iva5}`,
          style: 'grilla',
          absolutePosition: { x: positionX + 460, y: positionYGrilla },
        },
        {
          text: `${iva10}`,
          style: 'grilla',
          absolutePosition: { x: positionX + 510, y: positionYGrilla },
        },
      ];
      body = [...body, ...grilla];
    }

    //Fin Grilla
    //contenido General de la factura
    let content = [
      {
        text: `${notaCredito.numero_factura}`,
        style: 'header',
        absolutePosition: { x: positionX + 400, y: positionY + 100 },
      },
      {
        text: notaCredito.fecha,
        style: 'header',
        absolutePosition: { x: positionX + 100, y: positionY + 110 },
      },
      {
        text: `${this.cliente.nombre_apellido}`,
        style: 'header',
        absolutePosition: { x: positionX + 100, y: positionY + 120 },
      },
      {
        text: `${this.cliente.direccion}`,
        style: 'header',
        absolutePosition: { x: positionX + 100, y: positionY + 130 },
      },
      {
        text: `${this.cliente.ruc}`,
        style: 'header',
        absolutePosition: { x: positionX + 360, y: positionY + 120 },
      },
      {
        text: `${this.cliente.telefono}`,
        style: 'header',
        absolutePosition: { x: positionX + 360, y: positionY + 130 },
      },
      ...body,
      {
        text: `${subTotalExenta}`,
        style: 'header',
        absolutePosition: { x: positionX + 410, y: positionY + 335 },
      },
      {
        text: `${subTotalIva5}`,
        style: 'header',
        absolutePosition: { x: positionX + 460, y: positionY + 335 },
      },
      {
        text: `${subTotalIva10}`,
        style: 'header',
        absolutePosition: { x: positionX + 510, y: positionY + 335 },
      },

      {
        text: `${notaCredito.monto_letras}`,
        style: 'header',
        absolutePosition: { x: positionX + 110, y: positionY + 345 },
      },
      {
        text: notaCredito.total,
        style: 'header',
        absolutePosition: { x: positionX + 390, y: positionY + 345 },
      },
      {
        text: totalIva5,
        style: 'header',
        absolutePosition: { x: positionX + 160, y: positionY + 370 },
      },
      {
        text: totalIva10,
        style: 'header',
        absolutePosition: { x: positionX + 240, y: positionY + 370 },
      },
      {
        text: `${totalIva5 + totalIva10}`,
        style: 'header',
        absolutePosition: { x: positionX + 310, y: positionY + 370 },
      },
    ];
    return content;
  }
  async createPdf(notaCredito: any) {
    let original = this.crearHojaFactura(notaCredito, true);
    let copia = this.crearHojaFactura(notaCredito, false);
    const pdfDefinition: any = {
      // a string or { width: number, height: number }
      pageSize: 'A4',
      //formatear factura
      content: [...original, ...copia],
      styles: {
        header: {
          fontSize: 10,
          bold: true,
        },
        grilla: {
          fontSize: 8,
        },
        anotherStyle: {
          italics: true,
          alignment: 'right',
        },
      },
    };
    const pdfDocGenerator = pdfMake.createPdf(pdfDefinition);
    await pdfDocGenerator.getDataUrl((dataUrl) => {
      this.linkPdf = dataUrl;
    });
  }
  mostrarNotaCredito(notaCredito: any) {
    //this.linkPdf = `https://docs.google.com/gview?url=https://${link}&embedded=true`;
    this.createPdf(notaCredito);
    this.showModal();
  }
}
