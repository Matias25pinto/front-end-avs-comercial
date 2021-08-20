import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Articulo } from '../models/articulo.interface';
@Injectable({
  providedIn: 'root',
})
export class ArticulosService {
  private url: string = 'https://avs-backend.herokuapp.com';

  constructor(private http: HttpClient) {}

  crearArticulo(articulo: Articulo) {
    let body = articulo;
    this.http.post(`${this.url}/articulos/`, body);
  }
}
