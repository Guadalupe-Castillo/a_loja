import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtigoComponent } from './artigo.component';

const routes: Routes = [
  {
    path: ':barcode', 
    component: ArtigoComponent  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArtigoRoutingModule {}
