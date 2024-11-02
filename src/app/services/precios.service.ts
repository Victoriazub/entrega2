import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class PreciosService {

    constructor() { }

    get (){
        fetch ("http://localhost:4000/tarifas" , {
            method: "GET"
            })
        }

    update (idTarifa: string, nuevoPrecio: number){
        fetch ("http://localhost:4000/tarifas/${idTarifa}", {
            method: "PUT",
            body: JSON. stringify({
                valor : nuevoPrecio
            })
        })
    }
}