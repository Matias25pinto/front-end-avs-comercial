import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Marca } from '../models/marca.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MarcasService {
  private url: string = environment.url;

  constructor(private http: HttpClient) {}

  getMarcas() {
    return this.http.get<Array<Marca>>(`${this.url}/marcas/`);
  }

  crearMarca(body: Marca) {
    return this.http.post<Marca>(`${this.url}/marcas/`, body);
  }
}
