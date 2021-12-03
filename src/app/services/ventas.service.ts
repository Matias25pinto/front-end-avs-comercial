import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Venta, DetalleVenta, NotaCredito } from '../models/venta.interface';
import { environment } from '../../environments/environment';

export interface getVentas {
  count: number;
  next: string;
  previous: string;
  results: Array<vistaVenta>;
}
export interface vistaVenta {
  nombre_usuario: string;
  nombre_cliente: string;
  total: number;
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
  tipo_factura: string;
}

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private url = environment.url;

  constructor(private http: HttpClient) {}

  crearVenta(body: Venta) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');
    return this.http.post<postVenta>(`${this.url}/ventas/ventas/`, body, {
      headers,
    });
  }

  getVentas(pagina: string) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.get<getVentas>(pagina, { headers });
  }
  getVenta(id: number) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.get<postVenta>(`${this.url}/ventas/ventas/${id}/`, {
      headers,
    });
  }
  crearNotaCredito(body: NotaCredito) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');
    return this.http.post<any>(
      `${this.url}/nota-credito/nota-credito-venta/`,
      body,
      {
        headers,
      }
    );
  }
  getNotasCredito(pagina: string) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.get<any>(pagina, { headers });
  }
  getNotaCredito(id: number) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.get<any>(
      `${this.url}/nota-credito/nota-credito-venta/${id}/`,
      {
        headers,
      }
    );
  }
  aperturaArqueoCaja(body: any) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.post<any>(`${this.url}/cajas/arqueo-caja/`, body, {
      headers,
    });
  }
  cierreArqueoCaja(body: any) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.put<any>(`${this.url}/cajas/arqueo-caja/${body.id_arqueo_caja}/`, body, {
      headers,
    });
  }

  getArqueosCaja(pagina: string) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.get<any>(pagina, { headers });
  }
}
