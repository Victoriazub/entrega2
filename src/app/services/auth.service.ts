import { Injectable } from '@angular/core';
import { Login } from '../interfaces/login';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor() { } /* ver, preguntas */

  login(datosLogin: Login) {
    return fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datosLogin),
    })
      .then(res => {
        if (!res.ok) {
          // Si la respuesta no es exitosa, lanzar un error con el código de estado
          throw new Error(`Error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then(resJson => {
        if (resJson.status == 'ok') {
          // login correcto
          localStorage.setItem("token", resJson.token);
          return true;
        } else {
          return false;
        }
      })
      .catch(err => {
        // Manejar el error aquí (por ejemplo, credenciales incorrectas)
        console.error("Error en login:", err);
        return false;
      });
  }
 getToken(): string | null {
  return localStorage.getItem("token") ?? "";
 }

 estaLogueado(): boolean{
  if (this.getToken()){
    return true;
  } else{
  return false;
    }
 }

 logOut(){
  localStorage.removeItem("token");
 }
}
