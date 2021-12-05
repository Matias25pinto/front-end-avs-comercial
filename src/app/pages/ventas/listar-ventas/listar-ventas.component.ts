import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { VentasService } from '../../../services/ventas.service';
import { Venta, DetalleVenta } from '../../../models/venta.interface';

import { PersonaService } from '../../../services/persona.service';
import { Persona } from '../../../models/persona.interface';
import { ArticulosService } from '../../../services/articulos.service';

import { environment } from '../../../../environments/environment';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

//PDFmake en TypeScript
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

//Print.js
import printJS from 'print-js';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-listar-ventas',
  templateUrl: './listar-ventas.component.html',
})
export class ListarVentasComponent implements OnInit {
  public url = environment.url;
  public ventas: any[] = [];
  public siguiente: string = '';
  public anterior: string = '';
  public isLoading: boolean = false;
  public isError: boolean = false;
  public urlActual: string = '';

  public formularioBuscar: FormGroup;

  //mostrar factura
  public isVisible = false;
  public linkPdf: string = '';
  public clientes: Persona[] = [];
  public articulos: any[] = [];

  constructor(
    private ventasService: VentasService,
    private fb: FormBuilder,
    private personaService: PersonaService,
    private articulosService: ArticulosService,
    private router: Router
  ) {
    this.formularioBuscar = this.fb.group({
      venta: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarVentas(`${this.url}/ventas/ventas/`);
    this.cargarClientes();
    this.cargarArticulos();
  }
  crearNotaCredito(id: number) {
    this.router.navigate(['ventas', 'crear-nota-credito', id]);
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

  limpiarFormulario() {
    this.formularioBuscar.reset({ venta: '' });
  }

  enviarFormulario() {
    this.isError = false;
    if (this.formularioBuscar.valid) {
      const termino = this.formularioBuscar.get('venta')?.value;
      const pagina: string = `${this.url}/ventas/busqueda/?search=${termino}`;
      this.buscarVentas(pagina);
    } else {
      this.cargarVentas(`${this.url}/ventas/ventas/`);
    }
  }

  buscarVentas(pagina: string) {
    this.isLoading = true;
    this.ventas = [];
    this.siguiente = '';
    this.anterior = '';
    this.ventasService.getVentas(pagina).subscribe(
      (data) => {
        this.ventas = data.results;
        this.siguiente = data.next != null ? data.next : '';
        this.anterior = data.previous != null ? data.previous.toString() : '';
        this.urlActual = pagina;
        this.isLoading = false;
        if (this.ventas.length === 0) {
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

  cargarVentas(pagina: string) {
    this.isLoading = true;
    this.ventas = [];
    this.siguiente = '';
    this.anterior = '';
    this.ventasService.getVentas(pagina).subscribe(
      (data) => {
        console.log(data);
        this.ventas = data.results;
        this.siguiente = data.next != null ? data.next : '';
        this.anterior = data.previous != null ? data.previous.toString() : '';
        this.urlActual = pagina;
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
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

  mostrarFactura(id: number) {
    this.ventasService.getVenta(id).subscribe((venta) => {
      this.createPdf(venta);
      this.showModal();
    });
  }
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
          fontSize: 8,
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
}
