import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
})
export class AsideComponent implements OnInit {
  public user = JSON.parse(localStorage.getItem('user'));
  public rol = this.user.rol_usuario;

  constructor() {}

  ngOnInit(): void {
    console.log(this.user, this.rol);
  }
}
