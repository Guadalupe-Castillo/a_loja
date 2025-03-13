import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalizacoesModalComponent } from './localizacoes-modal.component';
import { Barcode, BarcodeFormat, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { DialogService } from '../../services/dialog.service';
import { SupabaseService } from 'src/services/supabase.service';
import { response } from 'express';

@Component({
  selector: 'app-localizacoes',
  templateUrl: './localizacoes.component.html',
  styleUrls: ['./localizacoes.component.scss'],
})
export class LocalizacoesComponent implements OnInit {
  @Input() barcode : string | null = null;
  public readonly barcodeFormat = BarcodeFormat;
  public barcodes : Barcode[] = [];
  public idartigo : string = '';
  public localizacao : any ;
  public artigos : any;
  public qt : number = 1;
  public index : number = 0;
  public validar : boolean = false;
  public confirmacao : boolean = false;
  public etiquetas : boolean = false;

  constructor(public route: ActivatedRoute,
              public server: SupabaseService,
              public readonly dialogService: DialogService,
              public router : Router,
    ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.barcode = params.get('barcode');
      if (this.barcode) {
        this.getLocalizacao(this.barcode);
        this.getArtigoLocalizacao(this.barcode);
      }
    })
  }

  public getLocalizacao(barcode: string): Promise<any> {
    return this.server.getLocalizacao(barcode).then((response) => {
      this.localizacao = response;
    })
    .catch(error => {
      console.log('Error fetching product:' + JSON.stringify(error));
    });
  }

  public getArtigoLocalizacao(barcode : string): Promise<any> {
    return this.server.getArtigoLocalizacao(barcode).then((response) => {
      this.artigos = response;
    }).catch(error => {
      console.log('Error fetching product:' + JSON.stringify(error));
    });
  }

  public getArtigo (idArtigo : any){
    this.server.getArtigo(idArtigo).then((response) =>{
      this.artigos.push(response[0])
    }).catch(error => {
      console.log('Error fetching product:' + JSON.stringify(error));
    });
  }

  public async addEtiquetas(event : any, bleh : boolean) {
    let qt : any = parseInt(event.target.elements.qt.value); 

    if(!qt && qt !== 0){
      qt = 1;
    }
    if (bleh == true){
      if(this.barcode){
        this.server.updateEtiqueta(this.idartigo, this.barcode, qt).catch(error => {
          console.log('Error fetching product:' + JSON.stringify(error));
        });    
      }
      this.artigos[this.index]['localizacaoartigos_t'][0]['etiqueta'] = qt;
      this.idartigo = '';
    }else{
      this.idartigo = '';
    }
  }

  public async deleteArtigoLocal(idartigo: string) {
    if (this.barcode) {
      try {
        await this.server.deleteLocalArtigo(idartigo, this.barcode);
        const idToDelete = idartigo;
        const indexToDelete = this.artigos.findIndex((item: { idartigo: any }) => item.idartigo === idToDelete);
        if (indexToDelete !== -1) {
          this.artigos.splice(indexToDelete, 1);
        }
          } catch (error) {
        console.log('Error fetching product:' + JSON.stringify(error));
      }
    }
  }
  
  public async addArtigoLocalizacao(idartigo : string){
    this.validar = true
    let localizacao = this.localizacao;
    localizacao[0]['idartigo'] = idartigo;
    localizacao[0]['qtlocal'] = 1;

    const interval = setInterval(() => {
      if (this.validar !== true) {
        if (this.confirmacao == true) {
          localizacao[0]['qtlocal'] = this.qt;
          this.server.insertLocalizacao(localizacao).catch(error => {
            alert('Error inserting local:' + error);
          });
          this.getArtigo(this.idartigo);
          this.idartigo = '';
          this.qt = 1;
          clearInterval(interval);
        }else {
          this.qt = 1;
          this.idartigo = '';
          clearInterval(interval);
        }
      }
    }, 100);
  }

  public async startScan(tipo : string): Promise<void> {
    const formats = [this.barcodeFormat.Aztec, this.barcodeFormat.Codabar, this.barcodeFormat.Code39, this.barcodeFormat.Code93, this.barcodeFormat.Code128, this.barcodeFormat.DataMatrix, this.barcodeFormat.Ean8, this.barcodeFormat.Ean13, this.barcodeFormat.Itf, this.barcodeFormat.Pdf417, this.barcodeFormat.UpcA, this.barcodeFormat.UpcE,];

    const element = await this.dialogService.showModal({
      component: LocalizacoesModalComponent,
      cssClass: 'barcode-scanning-modal',
      showBackdrop: false,
      componentProps: {
        formats: formats,
      },
    });

    element.onDidDismiss().then((result) => {
      const barcode: Barcode | undefined = result.data?.barcode;
      if (barcode) {
        this.idartigo = barcode.displayValue;
        this.addArtigoLocalizacao(this.idartigo);
      }
    });
  }

  public goToArtigoPage( barcode : string) {
    this.router.navigate(['artigo', barcode]);
  }
}