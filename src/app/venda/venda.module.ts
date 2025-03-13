import { NgModule } from '@angular/core';

import { VendaRoutingModule } from './venda-routing.module';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VendaComponent } from './venda.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, VendaRoutingModule],
  declarations: [VendaComponent],
})
export class VendaModule {}
