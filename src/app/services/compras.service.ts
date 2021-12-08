import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Compra } from '../models/compra.interface';
import { environment } from '../../environments/environment';

export interface getCompras {
  count: number;
  next: string;
  previous: string;
  results: Array<Compra>;
}

@Injectable({
  providedIn: 'root',
})
export class ComprasService {
  private url = environment.url;

  constructor(private http: HttpClient) {}

  getCompras(url: string) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.get<getCompras>(`${url}`, { headers });
  }

  getCompra(id: number) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.get<any>(`${this.url}/facturas/factura-compra/${id}/`, {
      headers,
    });
  }

  crearCompra(body: Compra) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.post<Compra>(
      `${this.url}/facturas/factura-compra/`,
      body,
      { headers }
    );
  }

  deleteCompra(id: number) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.delete<any>(`${this.url}/facturas/factura-compra/${id}/`, {
      headers,
    });
  }

  crearNotaCredito(body: any) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');
    return this.http.post<any>(
      `${this.url}/nota-credito/nota-credito-proveedor/`,
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
      `${this.url}/nota-credito/nota-credito-proveedor/${id}/`,
      {
        headers,
      }
    );
  }
  deleteNotaCredito(id: number) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.delete<any>(
      `${this.url}/nota-credito/nota-credito-proveedor/${id}/`,
      {
        headers,
      }
    );
  }
}
