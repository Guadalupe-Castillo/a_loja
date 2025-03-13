import { Component, OnInit } from '@angular/core';
import { response } from 'express';
import { SupabaseService } from 'src/services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public email: string = '';
  public pass: string = '';

  constructor(  public server: SupabaseService,
                public router : Router
              ) {}

  async handleLogin(event: any) {
    event.preventDefault()
    const loader = await this.server.createLoader()
    await loader.present()
    try {
      const { error } = await this.server.signIn(this.email, this.pass)
      if (error) {
        throw error
      }
      await loader.dismiss()
      this.router.navigate(['pag-principal']);
    } catch (error: any) {
      await loader.dismiss()
      await this.server.createNotice(error.error_description || error.message)
    }
  }


}