import { Component, OnInit } from '@angular/core';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';

import { VentasService } from '../../../services/ventas.service';
import { Venta } from '../../../models/venta.interface';

import { environment } from '../../../../environments/environment';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';


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

  constructor(
    private ventasService: VentasService,
    private fb: FormBuilder
  ) {
    this.formularioBuscar = this.fb.group({
      venta: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarVentas(`${this.url}/ventas/ventas/`);
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
}
