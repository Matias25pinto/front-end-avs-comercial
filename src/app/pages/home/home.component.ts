import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.recargarPagina();
  }

  recargarPagina() {
    const reload = localStorage.getItem('reload');
    if (!reload) {
      localStorage.setItem('reload', 'existe');
      window.location.reload();
    }
  }
}
