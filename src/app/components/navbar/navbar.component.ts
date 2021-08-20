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
    this.router.navigate(['login']);
  }
}
