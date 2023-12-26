import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getToken(): string {
    const storedData = localStorage.getItem('token');
    if (!storedData) {
      return "TokenGenericoDeUsuario";
    }
    return storedData;
  }
  
}
