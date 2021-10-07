import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Persona } from '../models/persona.interface';
import { environment } from '../../environments/environment';
export interface getPersonas {
  count: number;
  next: string;
  previous: string;
  results: Array<Persona>;
}
@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  private url = environment.url;

  constructor(private http: HttpClient) {}

  getPersonas(url: string) {
    return this.http.get<getPersonas>(`${url}`);
  }

  getPersona(url: string) {
    return this.http.get<Persona>(`${url}`);
  }
  deletePersona(url: string) {
    return this.http.delete(url);
  }

  crearPersona(body: Persona) {
    return this.http.post(`${this.url}/personas/`, body);
  }

  actualizarPersona(body: Persona) {
    return this.http.put(`${this.url}/personas/${body.id_persona}/`, body);
  }
}
