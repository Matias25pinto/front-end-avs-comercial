import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Proveedor } from '../models/proveedor.interface';
import { environment } from '../../environments/environment';

export interface getProveedores {
  count: number;
  next: string;
  previous: string;
  results: Array<Proveedor>;
}

@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {
  private url = environment.url;

  constructor(private http: HttpClient) {}

  getProveedores(url: string) {
    return this.http.get<getProveedores>(`${url}`);
  }

getProveedoresLista() {
    return this.http.get<any>(`${this.url}/proveedores/proveedores-lista/`);
  }

  getProveedor(url: string) {
    return this.http.get<Proveedor>(`${url}`);
  }

  crearProveedor(body: Proveedor) {
    return this.http.post<Proveedor>(`${this.url}/proveedores/`, body);
  }

  actualizarProveedor(body: Proveedor) {
    return this.http.put<Proveedor>(
      `${this.url}/proveedores/${body.id_proveedor}/`,
      body
    );
  }

  deleteProveedor(url: string) {
    return this.http.delete<Proveedor>(`${url}`);
  }
}
