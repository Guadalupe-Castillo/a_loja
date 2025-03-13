import { NgModule } from '@angular/core';
import { PagPrincipalRoutingModule } from './pag-principal-routing.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PagPrincipalModalComponent } from './pag-principal-modal.component';
import { PagPrincipalComponent } from './pag-principal.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, PagPrincipalRoutingModule, RouterModule],
  declarations: [PagPrincipalComponent, PagPrincipalModalComponent],
})
export class PagPrincipalModule {}