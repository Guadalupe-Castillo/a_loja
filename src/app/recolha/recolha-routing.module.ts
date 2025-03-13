import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecolhaComponent } from './recolha.component';

const routes: Routes = [
  {
    path: '',
    component: RecolhaComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecolhaRoutingModule {}
