import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.get<getCompras>(`${url}`);
  }

  getCompra(url: string) {
    return this.http.get<Compra>(`${url}`);
  }

  crearCompra(body: Compra) {
    return this.http.post<Compra>(`${this.url}/proveedores/`, body);
  }

  
  deleteCompra(url: string) {
    return this.http.delete<Compra>(`${url}`);
  }
}
