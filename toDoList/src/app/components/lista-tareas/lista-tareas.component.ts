import { Component } from '@angular/core';
import { ITarea } from 'src/app/services/ITarea';
import { UserService } from 'src/app/services/user.service';
import { HttpService } from '../../services/http.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-lista-tareas',
  templateUrl: './lista-tareas.component.html',
  styleUrls: ['./lista-tareas.component.css']
})
export class ListaTareasComponent {

  constructor(private httpService: HttpService, private userService: UserService) { }

  listaTareas: ITarea[] | null = null;

  ngOnInit() {
    this.obtenerTareas();
    this.f = this.obtenerFondo();
    this.setBackground(this.f);
  }

  obtenerTareas() {
    this.httpService.obtenerTareas(this.userService.username).subscribe(
      (response: any) => {
        this.listaTareas = response;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  async actualizarTareas() {
    const resultEnviar = await this.formEnviarTareas();
    if (this.listaTareas != null && resultEnviar) {
      this.httpService.actualizarTareas(this.userService.username, this.listaTareas).subscribe(
        (response: any) => {
          console.log(response);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Tareas actualizadas con exito.",
            showConfirmButton: false,
            timer: 2500
          });
        },
        (error: any) => {
          console.error(error)
        }
      );
    }
  }

  async nuevaTarea() {
    const values = await this.formNuevaTarea();
    if (values) {
      const newTask: ITarea = {
        titulo: values.title,
        descripcion: values.description,
        completada: false,
        prioridad: values.prioridad
      };
      this.listaTareas?.push(newTask);
      this.ordenarTareas()
    } else {
      console.log('Formulario cancelado o valores no proporcionados.');
    }
  }

  async eliminarTarea(tarea: ITarea) {
    const resultEliminar = await this.formEliminarTarea();
    if (resultEliminar && this.listaTareas) {
      this.listaTareas = this.listaTareas.filter((e) => e !== tarea);
    } else {
      console.log('No se ha eliminado la tarea');
    }
  }

  checkearTarea(tarea: ITarea) {
    this.listaTareas?.forEach((e: ITarea) => {
      if (e = tarea) {
        e.completada = !e.completada
      }
    })
  }

  ordenarTareas() {
    const copiaListaTareas = this.listaTareas ? [...this.listaTareas] : [];
    copiaListaTareas.sort((a, b) => a.prioridad - b.prioridad);
    this.listaTareas = copiaListaTareas;
  }

  f: number = 1;

  obtenerFondo(): number {
    const jsonData = localStorage.getItem("fondo");
    return jsonData ? Number(JSON.parse(jsonData)) : 1; // Valor predeterminado si no hay datos en el localStorage
  }

  cambiarFondo() {
    this.f++;
    if (this.f > 4) {
      this.f = 1;
    }
    this.setBackground(this.f);
  }

  setBackground(f: number) {
    console.log(f);
    const fondo = document.querySelector('.listaTareas') as HTMLElement;
    if (fondo) {
      fondo.style.backgroundImage = `url(../../../assets/bg${f}.png)`;
      const jsonData = JSON.stringify(f);
      localStorage.setItem("fondo", jsonData);
      const cuadro = document.querySelector('.listaTareas .content') as HTMLElement;
      if (f === 1){
        cuadro.style.backgroundColor = `rgba(255, 235, 209, 0.445)`;
      } else if (f === 2){
        cuadro.style.backgroundColor = `rgba(170, 183, 255, 0.445)`;
      } else if (f === 3){
        cuadro.style.backgroundColor = `rgba(252, 184, 218, 0.445)`;
      } else if (f === 4){
        cuadro.style.backgroundColor = `rgba(112, 169, 255, 0.5)`;
      }
    } else {
      console.error('Elemento con clase .listaTareas no encontrado.');
    }
  }


  async formEliminarTarea(): Promise<boolean> {
    const result = await Swal.fire({
      title: "¿Estas seguro?",
      text: "Eliminara esta tarea!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, confirmar!"
    })
    if (result.isConfirmed) {
      await Swal.fire({
        title: "Eliminada!",
        text: "Su tarea se ha eliminado.",
        icon: "success",
        showConfirmButton: false,
        padding: "3em",
        timer: 2500
      });
      return true;
    } else {
      return false;
    }
  };

  async formEnviarTareas(): Promise<boolean> {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No se podrá revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, enviar!"
    });
    if (result.isConfirmed) {
      await Swal.fire({
        title: "Enviado!",
        text: "Sus tareas se han actualizado.",
        icon: "success",
        showConfirmButton: false,
        padding: "3em",
        timer: 2500
      });
      return true;
    } else {
      return false;
    }
  }

  async formNuevaTarea(): Promise<any> {
    const { value: formValues, dismiss: dismissReason } = await Swal.fire({
      title: "Introduce los siguientes datos.",
      html: `
        <div class="alert">
          <label id="swal-label1" class="swal2-label">Título de la tarea.</label>
          <input id="swal-input1" class="swal2-input">
        </div>
        <div class="alert">
          <label id="swal-label2" class="swal2-label">Descripción de la tarea.</label>
          <textarea id="swal-input2" class="swal2-textarea"></textarea>
        </div>
        <div class="alert">
          <label for="numberInput">Prioridad: </label>
          <input type="number" id="numberInput" class="swal2-range" min="1" max="3" step="1" value="1">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const titleInput = document.getElementById("swal-input1") as HTMLInputElement;
        const descriptionInput = document.getElementById("swal-input2") as HTMLInputElement;

        const numberInput = document.getElementById("numberInput") as HTMLInputElement;

        if (!titleInput || !descriptionInput || !numberInput) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return;
        }

        const title = titleInput.value;
        const description = descriptionInput.value;
        const prioridad = parseInt(numberInput.value);

        if (!title || !description) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return;
        }

        if (isNaN(prioridad) || prioridad < 1 || prioridad > 3) {
          Swal.showValidationMessage("Por favor, introduce un número de prioridad del 1 al 3.");
          return;
        }

        return { title, description, prioridad };
      }
    });

    if (!formValues && dismissReason === Swal.DismissReason.cancel) {
      Swal.fire({
        icon: "error",
        title: "Operacion cancelada.",
        showConfirmButton: false,
        padding: "3em",
        timer: 1500
      });
      return null
    } else {
      return formValues
    }
  }
}
