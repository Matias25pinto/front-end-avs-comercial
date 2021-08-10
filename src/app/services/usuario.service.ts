import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Login } from '../models/usuario.interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private url: string = 'https://avs-backend.herokuapp.com';
  constructor(private http: HttpClient) {}

  iniciarSesion(email: string, password: string): Observable<Login> {
    const body = { email, password };
    return this.http.post<Login>(`${this.url}/users/login/`, body);
  }
}
