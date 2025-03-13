import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, HomeRoutingModule],
  declarations: [HomeComponent],
})
export class HomeModule {}
