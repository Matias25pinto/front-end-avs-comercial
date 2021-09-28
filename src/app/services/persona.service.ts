import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Persona } from '../models/persona.interface';

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

  constructor(private http: HttpClient) {}

  getPersonas(url: string) {
    return this.http.get<getPersonas>(
      `${url}`
    );
  }
  
  getPersona(url:string){
    return this.http.get<getPersonas>(`${url}`);
  }
  deletePersona(url: string) {
    return this.http.delete(url);
  }

  setPersonas() {}
}
