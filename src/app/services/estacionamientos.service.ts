import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Estacionamiento } from '../interfaces/estacionamiento';
import { Cochera } from '../interfaces/cochera';

@Injectable({
  providedIn: 'root',
})
export class EstacionamientosService {
  constructor() {}

  auth = inject(AuthService);

  cargar(): Promise<Estacionamiento[]> {
    return fetch('http://localhost:4000/estacionamientos', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + (this.auth.getToken() ?? ''),
      },
    }).then((res) => res.json());
  }

  buscarActivo(cocheraId: number): Promise<Estacionamiento | null> {
    return this.cargar().then((estacionamientos) => {
      let activo = null;
      for (let estacionamiento of estacionamientos) {
        if (
          estacionamiento.idCochera === cocheraId && estacionamiento.horaEgreso == null //todavia esta ocupada
        ) {
          activo = estacionamiento;
          break;
        }
      }
      return activo;
    });
  }

  abrir(patente: string, cocheraId: number) {
    return fetch('http://localhost:4000/estacionamientos/abrir', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + (this.auth.getToken() ?? ''),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patente: patente,
        cocheraId: cocheraId,
        idUsuarioIngreso: 'admin',
      }),
    }).then((res) => res.json());
  }

  cerrar(patente: string, cocheraId: number) {
    return fetch('http://localhost:4000/estacionamientos/cerrar', {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + (this.auth.getToken() ?? ''),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patente: patente,
        idUsuarioEgreso: 'admin',
      }),
    }).then((res) => res.json());
  }

  obtener(idCochera: number): Promise<Estacionamiento> {
    return fetch(`http://localhost:4000/estacionamientos/${idCochera}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.auth.getToken(),
      },
    }).then((res) => res.json());
  }
}
