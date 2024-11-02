import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Login } from '../../interfaces/login';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
/* Router para movernos entre partes de la aplicación */
  router = inject(Router);
  auth = inject(AuthService)

  visible: boolean = false;
  
  datosLogin: Login = {
    username: " ",
    password: " "
  }

  
  login(){
    this.auth.login(this.datosLogin)
    .then(ok => {
      if(ok){
        this.router.navigate(['/estado-cocheras']);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Credenciales incorrectas",
        });
        
      }
    });

  }
}


