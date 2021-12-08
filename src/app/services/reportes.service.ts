import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  private url: string = environment.url;

  constructor(private http: HttpClient) {}

  cantidadVentasDia() {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.get(`${this.url}/reportes/reporte-ventas-dia`, {
      headers,
    });
  }
  getArticulosStockMinimo() {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.get<Array<any>>(`${this.url}/reportes/reporte-articulos-stock/`, {
      headers,
    });
  }
}
