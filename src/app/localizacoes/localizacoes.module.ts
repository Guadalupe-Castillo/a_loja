import { NgModule } from '@angular/core';

import { LocalizacoesRoutingModule } from './localizacoes-routing.module';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LocalizacoesComponent } from './localizacoes.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, LocalizacoesRoutingModule],
  declarations: [LocalizacoesComponent],
})
export class LocalizacoesModule {}
