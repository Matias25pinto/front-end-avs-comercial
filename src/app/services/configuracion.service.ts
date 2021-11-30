import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PerfilImpresora } from '../models/configuracion.interface';
import { environment } from '../../environments/environment';

export interface getPerfilImpresora {
  count: number;
  next: string;
  previous: string;
  results: Array<PerfilImpresora>;
}

@Injectable({
  providedIn: 'root',
})
export class ConfiguracionService {
  private url: string = environment.url;

  constructor(private http: HttpClient) {}

  crearPerfilImpresora(body: PerfilImpresora) {
    return this.http.post<PerfilImpresora>(
      `${this.url}/configuracion/configuracion/`,
      body
    );
  }

  getPerfilesImpresora(url: string) {
    return this.http.get<getPerfilImpresora>(`${url}`);
  }
  getPerfilImpresora(url: string) {
    return this.http.get<PerfilImpresora>(`${url}`);
  }
  listaImpresoras(url: string) {
    return this.http.get<Array<PerfilImpresora>>(`${url}`);
  }
  actualizarPerfilImpresora(body: PerfilImpresora) {
    return this.http.put<PerfilImpresora>(
      `${this.url}/configuracion/configuracion/${body.id_impresora}/`,
      body
    );
  }

  deletePerfilImpresora(url: string) {
    return this.http.delete(`${url}`);
  }
}
