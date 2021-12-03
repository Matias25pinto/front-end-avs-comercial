import { Component, OnInit } from '@angular/core';
import { VentasService } from '../../services/ventas.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
})
export class AsideComponent implements OnInit {
  public user = JSON.parse(localStorage.getItem('user'));
  public rol = this.user.rol_usuario;
  public url = environment.url;
  public isVisibleCrearArqueo = false;

  constructor(private ventasService: VentasService) {}

  ngOnInit(): void {
    this.mostrarCrearArqueoCaja();
  }
  mostrarCrearArqueoCaja() {
    this.ventasService
      .getArqueosCaja(`${this.url}/cajas/arqueo-caja/`)
      .subscribe((data) => {
        let arqueos =
          data.results.filter((arqueo) => arqueo.id_empleado == this.user.id) ||
          [];
	console.log(arqueos);
        if (arqueos.length > 0) {
          let indice = 0;
          let ultimo_arqueo = arqueos[indice];
	  console.log(ultimo_arqueo);
          if (ultimo_arqueo.monto_cierre == 0) {
            this.isVisibleCrearArqueo = false;
          } else {
            this.isVisibleCrearArqueo = true;
          }
        } else {
          this.isVisibleCrearArqueo = true;
        }
      });
  }
}
