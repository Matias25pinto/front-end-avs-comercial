import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Articulo } from '../models/articulo.interface';
import { environment } from '../../environments/environment';

export interface getArticulos {
  count: number;
  next: string;
  previous: string;
  results: Array<Articulo>;
}

@Injectable({
  providedIn: 'root',
})
export class ArticulosService {
  private url: string = environment.url;

  constructor(private http: HttpClient) {}

  crearArticulo(body: Articulo) {
    return this.http.post<Articulo>(`${this.url}/articulos/`, body);
  }

  getArticulos(url: string) {
    return this.http.get<getArticulos>(`${url}`);
  }
  getArticulo(url: string) {
    return this.http.get<Articulo>(`${url}`);
  }
  getArticulosLista() {
    return this.http.get<Array<Articulo>>(
      `${this.url}/articulos/articulos-lista/`
    );
  }
  actualizarArticulo(body: Articulo) {
    return this.http.put<Articulo>(
      `${this.url}/articulos/${body.id_articulo}/`,
      body
    );
  }

  ajustarStockArticulo(body: any) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');

    return this.http.post(`${this.url}/articulos/ajuste-stock/`, body, {headers});
  }

  deleteArticulo(url: string) {
    return this.http.delete(`${url}`);
  }
}
