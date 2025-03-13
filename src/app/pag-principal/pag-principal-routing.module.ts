import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagPrincipalComponent } from './pag-principal.component';

const routes: Routes = [
  {
    path: '',
    component: PagPrincipalComponent,
  },
  {
    path: 'artigo',
    loadChildren: () =>
      import('../artigo/artigo.module').then(
        (m) => m.ArtigoModule,
      ),
  },
  {
    path: 'lista-artigos',
    loadChildren: () =>
      import('../lista-artigos/lista-artigos.module').then(
        (m) => m.ListaArtigosModule,
      ),
  },
  {
    path: 'venda',
    loadChildren: () =>
      import('../venda/venda.module').then(
        (m) => m.VendaModule,
      ),
  },
  {
    path: 'recolha',
    loadChildren: () =>
      import('../recolha/recolha.module').then(
        (m) => m.RecolhaModule,
      ),
  },  
  {
    path: 'logs',
    loadChildren: () =>
      import('../logs/logs.module').then(
        (m) => m.LogsModule,
      ),
  },
  {
    path: 'localizacoes',
    loadChildren: () =>
      import('../localizacoes/localizacoes.module').then(
        (m) => m.LocalizacoesModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagPrincipalRoutingModule {}
