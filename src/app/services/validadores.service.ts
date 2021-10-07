import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

interface ErrorValidate {
  [s: string]: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ValidadoresService {
  constructor() {}

  //validar si dos pass son iguales, es asincrono
  passwordsIguales(pass1Name: string, pass2Name: string) {
    console.log("se compara los passwords");
    return (formGrup: FormGroup) => {
      const pass1Control = formGrup.controls[pass1Name];
      const pass2Control = formGrup.controls[pass2Name];

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
    };
  }
}
