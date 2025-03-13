import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaArtigosComponent } from './lista-artigos.component';

const routes: Routes = [
  {
    path: ':search',
    component: ListaArtigosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaArtigosRoutingModule {}
