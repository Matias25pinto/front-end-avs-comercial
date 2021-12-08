import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login, User } from '../models/usuario.interfaces';
import { Observable } from 'rxjs';

export interface getUser {
  count: number;
  next: string;
  previous: string;
  results: Array<User>;
}

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

  crearUsuario(body: User) {
    return this.http.post<User>(`${this.url}/users/signup/`, body);
  }

  modificarUsuario(id_user: number, body: User) {
    return this.http.put<User>(`${this.url}/users/${id_user}/`, body);
  }

  getUsuarios(url: string) {
    return this.http.get<getUser>(url);
  }
  getUsuario(id_user: number) {
    return this.http.get<User>(`${this.url}/users/${id_user}/`);
  }

  buscarUsuario(url: string) {
    return this.http.get<getUser>(`${url}`);
  }

  cambiarPassword(body: any) {
    const access_token = `Token ${localStorage.getItem('access_token')}`;
    let headers = new HttpHeaders({
      authorization: access_token,
    }).set('Content-Type', 'application/json');
    return this.http.put(`${this.url}/users/cambiopassword/`, body, {
      headers,
    });
  }

  deleteUsuario(url: string) {
    return this.http.delete(url);
  }
}
