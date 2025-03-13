import { NgModule } from '@angular/core';

import { RecolhaRoutingModule } from './recolha-routing.module';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RecolhaComponent } from './recolha.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, RecolhaRoutingModule],
  declarations: [RecolhaComponent],
})
export class RecolhaModule {}
