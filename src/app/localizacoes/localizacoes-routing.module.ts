import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalizacoesComponent } from './localizacoes.component';

const routes: Routes = [
  {
    path: ':barcode',
    component: LocalizacoesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocalizacoesRoutingModule {}
