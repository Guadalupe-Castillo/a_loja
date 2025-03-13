import { NgModule } from '@angular/core';

import { ArtigoRoutingModule } from './artigo-routing.module';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ArtigoComponent } from './artigo.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, ArtigoRoutingModule],
  declarations: [ArtigoComponent],
})
export class ArtigoModule {}
