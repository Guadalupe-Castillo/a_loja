import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'pag-principal',
    loadChildren: () =>
      import('./pag-principal/pag-principal.module').then(
        (m) => m.PagPrincipalModule,
      ),
  },
  {
    path: 'lista-artigos',
    loadChildren: () =>
      import('./lista-artigos/lista-artigos.module').then(
        (m) => m.ListaArtigosModule,
      ),
  },
  {
    path: 'artigo',
    loadChildren: () =>
      import('./artigo/artigo.module').then(
        (m) => m.ArtigoModule,
      ),
  },
  {
    path: 'venda',
    loadChildren: () =>
      import('./venda/venda.module').then(
        (m) => m.VendaModule,
      ),
  },
  {
    path: 'recolha',
    loadChildren: () =>
      import('./recolha/recolha.module').then(
        (m) => m.RecolhaModule,
      ),
  },
  {
    path: 'logs',
    loadChildren: () =>
      import('./logs/logs.module').then(
        (m) => m.LogsModule,
      ),
  },
  {
    path: 'localizacoes',
    loadChildren: () =>
      import('./localizacoes/localizacoes.module').then(
        (m) => m.LocalizacoesModule,
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
