import { NgModule } from '@angular/core';

import { ListaArtigosRoutingModule } from './lista-artigos-routing.module';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ListaArtigosComponent } from './lista-artigos.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, ListaArtigosRoutingModule],
  declarations: [ListaArtigosComponent],
})
export class ListaArtigosModule {}
