import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Cochera } from "../../interfaces/cochera";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../../components/header/header.component";
import { AuthService } from "../../services/auth.service";
import { CocherasService } from "../../services/cocheras.service";
import { Estacionamiento } from "../../interfaces/estacionamiento";
import { EstacionamientosService } from "../../services/estacionamientos.service";
import { PreciosService } from "../../services/precios.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-estado-cocheras",
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent],
  templateUrl: "./estado-cocheras.component.html",
  styleUrls: ["./estado-cocheras.component.scss"]
})
export class EstadoCocherasComponent {
  esAdmin: boolean = true;

  auth = inject(AuthService);
  cocheras = inject(CocherasService);
  estacionamientos = inject(EstacionamientosService);
  tarifas = inject(PreciosService);

  filas: (Cochera & {activo: Estacionamiento | null })[] = [];

  ngOnInit() {
    this.reloadCocheras();
  }

 
  reloadCocheras() {
    return this.cocheras.cargar().then((cocheras) => {
      this.filas = [];
      for (let cochera of cocheras) {
        this.estacionamientos.buscarActivo(cochera.id).then((estacionamiento) => {
          this.filas.push({
            ...cochera,
            activo: estacionamiento,
          });
        });
      }
    });
  }

  ordenarCocheras() {
    this.filas.sort((a, b) => (b.id > a.id ? 1 : -1));
  }

  /**
   * Agrega una cochera a la tabla
   */
  agregarCochera() {
    this.cocheras.agregar().then(() => this.reloadCocheras()).then(() => this.ordenarCocheras());
  }

  /**
   * Cambia la disponibilidad de la cochera, si está deshabilitada la habilita
   */
  habilitarCochera(cocheraId: number) {
    const cochera = this.filas.find((cochera) => cochera.id === cocheraId);
    if (!cochera?.deshabilitada) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Esta cochera ya se encuentra habilitada",
      });
    } else {
      this.cocheras.habilitar(cochera).then(() => this.reloadCocheras()).then(() => this.ordenarCocheras());
    }
  }

  /**
   * Cambia la disponibilidad de la cochera, si está habilitada la deshabilita
   */
  deshabilitarCochera(cocheraId: number) {
    const cochera = this.filas.find((cochera) => cochera.id === cocheraId);
    if (cochera?.activo) {
      Swal.fire({
        icon: "error",
        title: "Cochera ocupada",
        text: "Para deshabilitar la cochera, primero debe cerrarse",
      });
    } else if (!cochera?.deshabilitada) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Esta cochera ya se encuentra deshabilitada",
      });
    } else {
      this.cocheras.deshabilitar(cochera).then(() => this.reloadCocheras()).then(() => this.ordenarCocheras());
    }
  }

  /**
   * Elimina una cochera
   */
  abrirModalEliminarCochera(cocheraId: number) {
    const cochera = this.filas.find((cochera) => cochera.id === cocheraId)!;
    if (!cochera.activo) {
      Swal.fire({
        title: "Está seguro de eliminar esta cochera?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar cochera",
      }).then((result) => {
        if (result.isConfirmed) {
          this.cocheras.eliminar(cochera).then(() => this.reloadCocheras()).then(() => this.ordenarCocheras());
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Cochera ocupada",
        text: "Para eliminar la cochera, primero debe cerrarse",
      });
    }
  }

  /**
   * Abre un nuevo estacionamiento - registra la patente de un auto
   */
  abrirModalNuevoEstacionamiento(cocheraId: number) {
    Swal.fire({
      title: "Ingrese el número de la patente",
      input: "text",
      inputLabel: "Patente",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Ingrese una patente válida.";
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.estacionamientos.abrir(result.value, cocheraId).then(() => this.reloadCocheras()).then(() => this.ordenarCocheras());
      }
    });
  }

  abrirModalCerrarEstacionamiento(cocheraId: number) {
    Swal.fire({
      title: "Desea cerrar este estacionamiento?",
      text: "Una vez cerrado se procede a su cobro automático",
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cerrar estacionamiento"
    })
}
}