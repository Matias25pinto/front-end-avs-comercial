import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  cerrarSesion() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('reload');
    localStorage.removeItem('user');
    localStorage.removeItem('coordenada_x');
    localStorage.removeItem('coordenada_y');

    this.router.navigate(['login']);
  }
  modificarPerfil() {
    let usuario = JSON.parse(localStorage.getItem('user'));

    this.router.navigate(['seguridad', 'modificar-usuario', usuario.id]);
  }
}
