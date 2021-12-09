import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  private url: string = environment.url;

  constructor(private http: HttpClient) {}

  totalCompras(body: any) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.post(`${this.url}/reportes/reporte-total-compras/`, body, {
      headers,
    });
  }
  totalVentas(body: any) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.post(`${this.url}/reportes/reporte-total-ventas/`, body, {
      headers,
    });
  }

  cantidadArticulosVendidos(body: any) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.post<Array<any>>(
      `${this.url}/reportes/reporte-cantidad-articulos-vendidos/`,
      body,
      {
        headers,
      }
    );
  }
  mejorVendedor(body: any) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.post<Array<any>>(
      `${this.url}/reportes/reporte-mejor-vendedor/`,
      body,
      {
        headers,
      }
    );
  }

  getVendedores(body: any) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.post<Array<any>>(
      `${this.url}/reportes/reporte-vendedores/`,
      body,
      {
        headers,
      }
    );
  }

  getArticulosStockMinimo() {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.get<Array<any>>(
      `${this.url}/reportes/reporte-articulos-stock/`,
      {
        headers,
      }
    );
  }
}
