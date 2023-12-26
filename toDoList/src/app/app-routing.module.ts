import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ListaTareasComponent } from './components/lista-tareas/lista-tareas.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'listaTareas', component: ListaTareasComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
