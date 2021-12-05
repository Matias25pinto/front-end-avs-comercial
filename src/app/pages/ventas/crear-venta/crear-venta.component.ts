import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonaService } from '../../../services/persona.service';
import { Persona } from '../../../models/persona.interface';
import { ArticulosService } from '../../../services/articulos.service';
import { Venta, DetalleVenta } from '../../../models/venta.interface';
import { VentasService } from '../../../services/ventas.service';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

//PDFmake en TypeScript
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

//Print.js
import printJS from 'print-js';

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
  selector: 'app-crear-venta',
  templateUrl: './crear-venta.component.html',
})
export class CrearVentaComponent implements OnInit, AfterViewChecked {
  public isModal = false;
  public isLoadingCliente = false;
  public clientes: Persona[] = [];
  public articulos: any[] = [];
  public grilla: any[] = [];
  public totalVenta: number = 0;
  public iva10: number = 0;
  public iva5: number = 0;
  public exenta: number = 0;
  public formularioVenta: FormGroup;
  public formularioGrilla: FormGroup;

  public isVisible = false;
  public linkPdf: string = '';
  public isLoadingIframe: boolean = false;

  public vuelto: number = 0;

  constructor(
    private fb: FormBuilder,
    private personaService: PersonaService,
    private articulosService: ArticulosService,
    private ventasService: VentasService
  ) {
    this.formularioVenta = this.fb.group({
      cliente: ['', [Validators.required]],
      importe: ['', [Validators.required]],
      tipo_factura: ['CON', Validators.required],
    });
    this.formularioGrilla = this.fb.group({
      codigo: ['', [Validators.required]],
      cantidad: [1, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.cargarClientes();
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
  cargarClientes() {
    this.personaService.getPersonasLista().subscribe((resp) => {
      this.clientes = resp;
    });
  }
  addCliente(elemento: HTMLInputElement) {
    this.isModal = true;
    elemento.click();
  }
  public handleKeyDownGrilla(event: any) {
    //keycode de enter es 13
    if (event.keyCode == 13) {
      this.enviarFormularioGrilla();
    }
  }
  agregarGrilla(codigo: string, cantidadString: string) {
    let articulo = this.articulos.find((articulo) => {
      if (articulo.codigo_barras == codigo) {
        return articulo;
      }
    });
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
      if (cantidad < 3) {
        precio = articulo.precio_unitario;
        tipo_precio = 'Unitario';
      } else if (cantidad >= 3 && cantidad < 12) {
        precio = articulo.precio_mayorista;
        tipo_precio = 'Mayorista';
      } else if (cantidad >= 12) {
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
  public handleKeyDownPagar(event: any, id_usuario: any, importe: string) {
    //keycode de enter es 13
    if (event.keyCode == 13) {
      if (parseInt(importe) > 0) {
      }
    }
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
  limpiarFormularioGrilla() {
    this.formularioGrilla.reset({ codigo: '', cantidad: 1 });
  }
  limpiarFormularioVenta() {
    this.formularioVenta.reset({
      cliente: '',
      importe: '',
      tipo_factura: 'CON',
    });
    this.grilla = [];
    this.totalVenta = 0;
    this.iva10 = 0;
    this.iva5 = 0;
    this.exenta = 0;
  }
  enviarFormularioVenta() {
    if (this.formularioVenta.valid && this.totalVenta > 0) {
      const id_cliente = this.formularioVenta.get('cliente')?.value;
      const importe = this.formularioVenta.get('importe')?.value;
      const tipo_factura = this.formularioVenta.get('tipo_factura')?.value;
      //calcular vuelto
      this.vuelto = importe - this.totalVenta;
      if (importe >= this.totalVenta) {
        let fecha = new Date();
        let fecha_creacion = `${fecha.getFullYear()}-${
          fecha.getMonth() + 1
        }-${fecha.getDate()}`;
        let detalleVenta: DetalleVenta[] = this.grilla.map((articulo) => {
          let detalle: DetalleVenta = {
            precio_unitario: articulo.precio_unitario,
            sub_total_iva: articulo.sub_total_iva,
            tipo_iva: articulo.tipo_iva,
            nombre_articulo: articulo.nombre_articulo,
            estado: 'A',
            fecha_creacion: fecha_creacion,
            cantidad: articulo.cantidad,
            sub_total: articulo.cantidad * articulo.precio,
            id_articulo: articulo.id_articulo,
            codigo_articulo: articulo.codigo_articulo,
          };
          return detalle;
        });

        let body: Venta = {
          id_detalle_venta: detalleVenta,
          id_venta: 0,
          estado: 'A',
          fecha_creacion: fecha_creacion,
          fecha: fecha_creacion,
          total: this.totalVenta,
          id_cliente: id_cliente,
          tipo_factura,
        };

        this.ventasService.crearVenta(body).subscribe(
          (resp) => {
            console.log(resp);
            let link: string = resp.factura;
            this.mostrarVuelto(resp);
            this.limpiarFormularioGrilla();
            this.limpiarFormularioVenta();
          },
          (err) => {
            Swal.fire({
              icon: 'error',
              title: 'No se pudo realizar la venta',
              text: 'Verificar su conexión a internet',
            });
          }
        );
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Importe Insuficiente',
          text: 'El monto del importe debe ser mayor o igual al total de la venta',
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El campo cliente y el importe son obligatorios',
        footer: '<p>Verificar el campo cliente y el campo importe</p>',
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
  /*
  crearHojaFactura(venta: Venta, original: boolean) {
    //Crear Grilla
    let detalleVenta: Array<DetalleVenta> = venta.id_detalle_venta;

    let body = [];

    let cliente = this.clientes.find(
      (cliente) => cliente.id_persona == venta.id_cliente
    );

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
        iva10 = parseInt(articulo.sub_total.toString());
        totalIva10 = totalIva10 + parseInt(articulo.sub_total_iva.toString());
        subTotalIva10 = subTotalIva10 + iva10;
        totalIva = totalIva + parseInt(articulo.sub_total_iva.toString());
      }
      if (articulo.tipo_iva == 5) {
        iva5 = parseInt(articulo.sub_total.toString());
        totalIva5 = totalIva5 + parseInt(articulo.sub_total_iva.toString());
        subTotalIva5 = subTotalIva5 + iva5;
        totalIva = totalIva + parseInt(articulo.sub_total_iva.toString());
      }
      if (articulo.tipo_iva == 0) {
        exenta = parseInt(articulo.sub_total.toString());
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
        text: `${venta.numero_factura}`,
        style: 'header',
        absolutePosition: { x: positionX + 400, y: positionY + 100 },
      },
      {
        text: venta.fecha,
        style: 'header',
        absolutePosition: { x: positionX + 100, y: positionY + 110 },
      },
      {
        text: `${cliente.nombre_apellido}`,
        style: 'header',
        absolutePosition: { x: positionX + 100, y: positionY + 120 },
      },
      {
        text: `${cliente.direccion}`,
        style: 'header',
        absolutePosition: { x: positionX + 100, y: positionY + 130 },
      },
      {
        text: 'X',
        style: 'header',
        absolutePosition: {
          x: venta.tipo_factura == 'CON' ? positionX + 400 : positionX + 450,
          y: positionY + 110,
        },
      },
      {
        text: `${cliente.ruc}`,
        style: 'header',
        absolutePosition: { x: positionX + 360, y: positionY + 120 },
      },
      {
        text: `${cliente.telefono}`,
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
        text: `${venta.monto_letras}`,
        style: 'header',
        absolutePosition: { x: positionX + 110, y: positionY + 345 },
      },
      {
        text: venta.total,
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
  */
  crearHojaFactura(venta: Venta, original: boolean) {
    //Crear Grilla
    let detalleVenta: Array<DetalleVenta> = venta.id_detalle_venta;

    let body = [];

    let cliente = this.clientes.find(
      (cliente) => cliente.id_persona == venta.id_cliente
    );

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
        iva10 = parseInt(articulo.sub_total.toString());
        totalIva10 = totalIva10 + parseInt(articulo.sub_total_iva.toString());
        subTotalIva10 = subTotalIva10 + iva10;
        totalIva = totalIva + parseInt(articulo.sub_total_iva.toString());
      }
      if (articulo.tipo_iva == 5) {
        iva5 = parseInt(articulo.sub_total.toString());
        totalIva5 = totalIva5 + parseInt(articulo.sub_total_iva.toString());
        subTotalIva5 = subTotalIva5 + iva5;
        totalIva = totalIva + parseInt(articulo.sub_total_iva.toString());
      }
      if (articulo.tipo_iva == 0) {
        exenta = parseInt(articulo.sub_total.toString());
        totalExenta = totalExenta + parseInt(articulo.sub_total_iva.toString());
        subTotalExenta = subTotalExenta + exenta;
      }
      let grilla: Array<any> = [
        {
          text: articulo.codigo_articulo,
          style: 'grilla',
          absolutePosition: { x: positionX + 80, y: positionYGrilla },
        },
        {
          text: articulo.cantidad,
          style: 'grilla',
          absolutePosition: { x: positionX + 140, y: positionYGrilla },
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
          absolutePosition: { x: positionX + 520, y: positionYGrilla },
        },
      ];
      body = [...body, ...grilla];
    }

    //Fin Grilla
    //contenido General de la factura
    let content = [
      {
        text: `${venta.numero_factura}`,
        style: 'header',
        absolutePosition: {
          x: original ? positionX + 440 : positionX + 470,
          y: positionY + 90,
        },
      },
      {
        text: venta.fecha,
        style: 'header',
        absolutePosition: { x: positionX + 148, y: positionY + 110 },
      },
      {
        text: `${cliente.nombre_apellido}`,
        style: 'header',
        absolutePosition: { x: positionX + 173, y: positionY + 120 },
      },
      {
        text: `${cliente.direccion}`,
        style: 'header',
        absolutePosition: { x: positionX + 118, y: positionY + 130 },
      },
      {
        text: 'X',
        style: 'header',
        absolutePosition: {
          x: venta.tipo_factura == 'CON' ? positionX + 500 : positionX + 533,
          y: positionY + 110,
        },
      },
      {
        text: `${cliente.ruc}`,
        style: 'header',
        absolutePosition: { x: positionX + 370, y: positionY + 120 },
      },
      {
        text: `${cliente.telefono}`,
        style: 'header',
        absolutePosition: { x: positionX + 390, y: positionY + 130 },
      },
      ...body,
      {
        text: `${subTotalExenta}`,
        style: 'header',
        absolutePosition: { x: positionX + 415, y: positionY + 295 },
      },
      {
        text: `${subTotalIva5}`,
        style: 'header',
        absolutePosition: { x: positionX + 460, y: positionY + 295 },
      },
      {
        text: `${subTotalIva10}`,
        style: 'header',
        absolutePosition: { x: positionX + 515, y: positionY + 295 },
      },

      {
        text: `${venta.monto_letras}`,
        style: 'header',
        absolutePosition: { x: positionX + 143, y: positionY + 305 },
      },
      {
        text: venta.total,
        style: 'header',
        absolutePosition: { x: positionX + 458, y: positionY + 305 },
      },
      {
        text: totalIva5,
        style: 'header',
        absolutePosition: { x: positionX + 205, y: positionY + 315 },
      },
      {
        text: totalIva10,
        style: 'header',
        absolutePosition: { x: positionX + 315, y: positionY + 315 },
      },
      {
        text: `${totalIva5 + totalIva10}`,
        style: 'header',
        absolutePosition: { x: positionX + 440, y: positionY + 315 },
      },
    ];
    return content;
  }

  async createPdf(venta: Venta) {
    let original = this.crearHojaFactura(venta, true);
    let copia = this.crearHojaFactura(venta, false);
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
      //printJS(dataUrl);
      //printJS({printable:dataUrl, type:'pdf', showModal:true})
    });

    //pdfDocGenerator.print({});
    //this.imprimirIframe();
  }
  mostrarVuelto(venta: Venta) {
    //this.linkPdf = `https://docs.google.com/gview?url=https://${link}&embedded=true`;
    this.createPdf(venta);
    this.showModal();
  }
  imprimirIframe() {
    let iframe: HTMLIFrameElement = document.getElementById(
      'iframe'
    ) as HTMLIFrameElement;
    if (iframe) {
      iframe.onload = () => {
        console.log('imprimir el pdf');
        const element = iframe.contentWindow;
        element.focus();
        element.print();
      };
    }
  }
}
