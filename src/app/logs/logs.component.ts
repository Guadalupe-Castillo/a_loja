import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/services/supabase.service';
import * as moment from 'moment';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit {
  logs : any;
  time : any;
  datas: { value: string, label: string }[] = [];
  dataEscolhida : any;

  constructor(public server : SupabaseService) {}

  ngOnInit() {
    this.getDatas();

    this.getLogs();
  }

  public getLogs(){
    this.server.getLogs().then((response) => {
      this.logs = response;      
    }).catch(error => {
      console.log('Error fetching product:' + JSON.stringify(error));
    });  
  }

  public getDatas() {
    const today = moment().format('YYYY-MM-DD');
    const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
    const startOfWeek = moment().startOf('isoWeek').format('YYYY-MM-DD');
    const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');

    this.datas = [
      { value: today, label: 'Hoje' },
      { value: yesterday, label: 'Ontem' },
      { value: startOfWeek, label: 'Esta semana' },
      { value: startOfMonth, label: 'Este mês' },
    ];

    this.dataEscolhida = this.datas[0]['value']
  }  
}
