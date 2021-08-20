import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(): boolean {
    let access = true;
    const token = localStorage.getItem('access_token');
    if (!token) {
      access = false;
      this.router.navigate(['login']);
    }
    return access;
  }
}
