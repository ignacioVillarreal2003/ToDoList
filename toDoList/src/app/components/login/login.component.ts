import { Component } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private httpService: HttpService, private router: Router, private userService: UserService){}

  username: string = "";
  password: string = "";

  verificarDatos(): boolean{
    if (this.username.length < 8 && this.password.length < 8){
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Requiere usuario y contraseña de 8 caracteres.",
      });
      return false;
    }
    else if (this.username.length < 8){
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Requiere usuario de 8 caracteres.",
      });
      return false;
    }
    else if (this.password.length < 8){
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Requiere contraseña de 8 caracteres."
      });
      return false;
    }
    return true
  }

  ingresar(){
    if (this.verificarDatos()){
      this.httpService.loguearUsuario(this.username, this.password).subscribe(
        (response: any) => {
          localStorage.setItem('token', response);
          this.userService.username = this.username;
          this.router.navigate(['/listaTareas']);
        },
        (error: any) => {          
          Swal.fire({
            icon: "error",
            title: "Oops... \nAlgo salio mal",
            text: error
          });
        }
      );
    }
  }

  registrar(){
    if (this.verificarDatos()){
      this.httpService.registrarUsuario(this.username, this.password).subscribe(
        (response: any) => {
          localStorage.setItem('token', response);
          this.userService.username = this.username;
          this.router.navigate(['/listaTareas']);
        },
        (error: any) => {
          Swal.fire({
            icon: "error",
            title: "Oops... \nAlgo salio mal",
            text: error
          });
        }
      );
    }
  }

  
}
