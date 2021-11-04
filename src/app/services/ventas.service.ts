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

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private url = environment.url;

  constructor(private http: HttpClient) {}

  crearVenta(body: Venta) {
    return this.http.post(`${this.url}/ventas/ventas/`, body);
  }

  getVentas(pagina: string) {
    return this.http.get<getVentas>(pagina);
  }
}
