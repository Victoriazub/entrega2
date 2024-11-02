import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { EstacionamientosService } from '../../services/estacionamientos.service';
import { Reportes } from '../../interfaces/reporte';
import { Estacionamiento } from '../../interfaces/estacionamiento';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent {
  estacionamientos = inject(EstacionamientosService);
  historialEstacionamientos: Estacionamiento[]= [];
  listaReportes: Reportes[] = [];

  ngOnInit() {
    this.cargarReportes();
  }

  cargarReportes() {
    this.estacionamientos.cargar().then(estacionados => {
      for (let registro of estacionados) {
        if (registro.horaIngreso !=null) {
          this.historialEstacionamientos.push(registro);
        }
      }
      
      this.historialEstacionamientos.sort((a, b) => {
        return new Date(a.horaIngreso).getTime() - new Date(b.horaIngreso).getTime();
      });

      const mesesTrabajo: string[] = [];
      const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      
      for (let estacionada of this.historialEstacionamientos) {
        const fechaIngreso = new Date(estacionada.horaIngreso);
        const mesIndex = fechaIngreso.getMonth();
        const mes = meses[mesIndex];

        if (!mesesTrabajo.includes(mes)) {
          mesesTrabajo.push(mes);
          this.listaReportes.push({
            numero: this.listaReportes.length + 1,
            mes: mes,
            ingresos: 1,
            totalCobrado: estacionada.costo ?? 0
          });
        } else {
          const reporteExistente = this.listaReportes.find(r => r.mes === mes)!;
          
            reporteExistente.ingresos++;
            reporteExistente.totalCobrado += estacionada.costo ?? 0;
          
        }
      }
    });
  }
}
