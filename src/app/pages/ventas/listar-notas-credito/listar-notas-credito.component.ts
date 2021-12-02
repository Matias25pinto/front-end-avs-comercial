import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-listar-notas-credito',
  templateUrl: './listar-notas-credito.component.html',
})
export class ListarNotasCreditoComponent implements OnInit {
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
  public linkPdf: string = '';
  public clientes: Persona[] = [];
  public articulos: any[] = [];
  public idCliente: number;
  public cliente: Persona;

  constructor(
    private ventasService: VentasService,
    private fb: FormBuilder,
    private personaService: PersonaService,
    private articulosService: ArticulosService,
    private router: Router
  ) {
    this.formularioBuscar = this.fb.group({
      notaCredito: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarNotasCredito(`${this.url}/nota-credito/nota-credito-venta/`);
    this.cargarClientes();
    this.cargarArticulos();
  }
  cargarArticulos() {
    this.articulosService.getArticulosLista().subscribe((articulos) => {
      this.articulos = articulos;
    });
  }
  cargarClientes() {
    this.personaService.getPersonasLista().subscribe((resp) => {
      this.clientes = resp;
      this.cliente = resp.find(
        (persona) => persona.id_persona == this.idCliente
      );
    });
  }
  limpiarFormulario() {
    this.formularioBuscar.reset({ notaCredito: '' });
  }

  enviarFormulario() {
    this.isError = false;
    if (this.formularioBuscar.valid) {
      const termino = this.formularioBuscar.get('notaCredito')?.value;
      const pagina: string = `${this.url}/nota-credito/busqueda/?search=${termino}`;
      this.buscarNotaCredito(pagina);
    } else {
      this.cargarNotasCredito(`${this.url}/nota-credito/nota-credito-venta/`);
    }
  }

  buscarNotaCredito(pagina: string) {
    this.isLoading = true;
    this.notasCredito = [];
    this.siguiente = '';
    this.anterior = '';
    this.ventasService.getNotasCredito(pagina).subscribe(
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
  cargarCliente(id:number){
   return this.clientes.find(cliente => cliente.id_persona == id);
  }

  cargarNotasCredito(pagina: string) {
    this.isLoading = true;
    this.notasCredito = [];
    this.siguiente = '';
    this.anterior = '';
    this.ventasService.getNotasCredito(pagina).subscribe(
      (data) => {
        console.log(data);
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

  mostrarNotaCredito(id: number) {
    this.ventasService.getNotaCredito(id).subscribe((notaCredito) => {
      console.log(notaCredito);
      this.cliente = this.cargarCliente(notaCredito.id_cliente);
      this.createPdf(notaCredito);
      this.showModal();
    });
  }
  crearHojaFactura(notaCredito: any, original: boolean) {
    //Crear Grilla
    let detalleNotaCredito: Array<any> = notaCredito.id_detalle_nota_credito;

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

    for (let articulo of detalleNotaCredito) {
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
}
