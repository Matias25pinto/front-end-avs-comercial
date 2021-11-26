import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Venta, DetalleVenta } from '../models/venta.interface';
import { environment } from '../../environments/environment';

export interface getVentas {
  count: number;
  next: string;
  previous: string;
  results: Array<Venta>;
}
export interface postVenta {
  estado: string;
  factura: string;
  fecha: string;
  fecha_creacion: string;
  id_cliente: number;
  id_detalle_venta: Array<DetalleVenta>;
  id_venta: number;
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private url = environment.url;

  constructor(private http: HttpClient) {}

  crearVenta(body: Venta) {
    return this.http.post<postVenta>(`${this.url}/ventas/ventas/`, body);
  }

  getVentas(pagina: string) {
    return this.http.get<getVentas>(pagina);
  }
}
