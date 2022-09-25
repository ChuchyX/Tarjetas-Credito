import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { TarjetaService } from '../services/tarjeta.service';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.css']
})
export class TarjetaComponent implements OnInit {

  listTarjetas: any[] = [];

  accion = "Agregar";
  id : number | undefined;

  form: FormGroup;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private tarjetaService: TarjetaService) {
    this.form = fb.group({
      titular: ['', Validators.required],
      numTarjeta: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      fechaExp: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
      cvv: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas() {
    this.tarjetaService.getListTarjetas().subscribe(data => {
      this.listTarjetas = data;
      console.log(data);
    }, error => {
      console.log(error);
    })
  }

  guardarTarjeta() {

    const tarjeta: any = {
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numTarjeta')?.value,
      fechaExpiracion: this.form.get('fechaExp')?.value,
      cvv: this.form.get('cvv')?.value
    }

    if(this.id == undefined)
    {
      this.tarjetaService.saveTarjeta(tarjeta).subscribe(data =>{
        this.toastr.success('La tarjeta fue registrada con exito!!!', 'Registro de Tarjeta');
        this.obtenerTarjetas();
        this.form.reset();
      }, error => {
        this.toastr.error('Opsss...ocurrio un error', 'Error');
      })
    }
    else{
      tarjeta.id = this.id;
        this.tarjetaService.updateTarjeta(this.id, tarjeta).subscribe(data => {
          this.form.reset();
          this.accion = "Agregar";
          this.id = undefined;
          this.toastr.info("La tarjeta fue actualizada con exito!!!", "Tarjeta Actualizada");
          this.obtenerTarjetas();
        }, error => {
          this.toastr.error('Opsss...ocurrio un error', 'Error');
        })
    }

    
    
  }

  eliminarTarjeta(id: number) {
    this.tarjetaService.deleteTarjeta(id).subscribe(data => {
      this.toastr.error('La tarjeta fue eliminada!!!', 'Eliminar Tarjeta');
      this.obtenerTarjetas();
    }, error => {
      console.log(error);
    })
    
  }

  editarTarjeta(tarjeta: any){
    this.accion = "Editar";
    this.id = tarjeta.id;

    this.form.patchValue({
      titular: tarjeta.titular,
      numTarjeta: tarjeta.numeroTarjeta,
      fechaExp: tarjeta.fechaExpiracion,
      cvv : tarjeta.cvv
    })
  }

}
