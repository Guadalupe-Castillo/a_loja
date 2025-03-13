import { NgModule } from '@angular/core';

import { LogsRoutingModule } from './logs-routing.module';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LogsComponent } from './logs.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, LogsRoutingModule],
  declarations: [LogsComponent],
})
export class LogsModule {}
