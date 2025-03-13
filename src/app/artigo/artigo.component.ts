import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from 'src/services/supabase.service';
import { Component, NgZone, Input, OnInit } from '@angular/core';
import { Barcode, BarcodeFormat, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { DialogService } from '../../services/dialog.service';
import { ArtigoModalComponent } from './artigo-modal.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-artigo',
  templateUrl: './artigo.component.html',
  styleUrls: ['./artigo.component.scss'],
})
export class ArtigoComponent implements OnInit {
  @Input() barcode: string | null = null;
  public artigos: any;
  public img: any;
  public selectedImg: any;
  public localizacoesArtigo: any = [];
  public locais: any;
  public sublocais: { index: number; sublocais: any[] }[] = [];
  public posicoes: { index: number; posicoes: any[] }[] = [];
  public deleteData: any = [];
  public addData: any = [0 , 0];
  public localId : any;
  public hideLocais: any = Array(50).fill(-1);
  public confirmar: any = 'nulo';
  public showConfirmar: boolean = false;
  public dropdown : boolean = false;
  public dataEmZero: any = [];
  public segmentValue: string = "consulta";
  public dataOriginal: any = [];
  public readonly barcodeFormat = BarcodeFormat;
  public barcodes: Barcode[] = [];
  public isSupported = false;
  public isPermissionGranted = false;
  public isQtStock : boolean = false;

  constructor(
    public readonly dialogService: DialogService,
    public readonly server: SupabaseService,
    public route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.barcode = params.get('barcode');
      if (this.barcode) {
        if(this.barcode.length < 6){
          this.getArtigo(this.barcode);
          this.getLocalProducto(this.barcode);
        }else{
          this.getArtigoByEAN(this.barcode);
        }
      }
    });
    this.getLocais();
  }

  public getArtigo(barcode: string) {
    this.server.getArtigo(barcode).then((response) => {
      this.artigos = response;
      this.setImg(response);
    })
    .catch(error => {
      console.log('Error fetching product:' + JSON.stringify(error));
    });
  }

  public getArtigoByEAN(barcode: string){
    this.server.getArtigoByEAN(barcode).then((response) => {
      this.artigos = response;
      this.barcode = response[0]['idartigo'];
      this.getLocalProducto(response[0]['idartigo']);
      this.setImg(response);
    })
    .catch(error => {
      console.log('Error fetching product:' + JSON.stringify(error));
    });
  }

  public setImg(response : any){
    this.img = response[0]['imgurl'].split(',');
    this.selectedImg = this.img[0];
  }

  public getLocalProducto(barcode : any){
    this.server.getLocalizacoesArtigos(barcode).then((response) => {
      this.dataOriginal = JSON.parse(JSON.stringify(response));
      this.localizacoesArtigo = response;
      for (var i = 0; i < this.localizacoesArtigo.length ;i++){
        this.getSubLocais(i, this.localizacoesArtigo[i]['idlocalizacao']);
        this.getPosicoes(i, this.localizacoesArtigo[i]['idsublocalizacao']);
      }
    })
    .catch(error => {
      alert('Error fetching product:' + JSON.stringify(error));
    });
  }

  public getLocais() {
    this.server.getLocais().then((response) => {
      this.locais = response;
    })
    .catch(error => {
      alert('Error fetching locations:' + JSON.stringify(error));
    });
  }

  public getSubLocais(index: number, idLocal: number): Promise<any> {
    return this.server.getSublocais(idLocal)
    .then(response => {
      const existingIndex = this.sublocais.findIndex(sublocal => sublocal.index === index);
      if (existingIndex !== -1) {
        this.sublocais[index].sublocais = response;
      } else {
        this.sublocais.push({ index: index, sublocais: response });
      }
    })
    .catch(error => {
      alert('Error fetching sublocations: ' + JSON.stringify(error));
    });
  }  

  public getPosicoes(index: number, idSubLocal: number): Promise<any> {
    return this.server.getPosicoes(idSubLocal)
    .then(response => {
      const existingIndex = this.posicoes.findIndex(posicao => posicao.index === index);
      if (existingIndex !== -1) {
        this.posicoes[index].posicoes = response;
      } else {
        this.posicoes.push({ index: index, posicoes: response });
      }
    })
    .catch(error => {
      alert('Error fetching positions: ' + JSON.stringify(error));
    });
  }
  
  public getIdLocal(idL: number, idS: number, idP: number): Promise<any> {
    return this.server.getIdLocal(idL, idS, idP).then(response => {
      return response;
    });
  }

  public getLocalizacao(id: string): Promise<any> {
    return this.server.getLocalizacao(id).then(response => {
      this.onAddLocais(response[0]);
    })
  }
  
  public dropDown(){
    if (this.dropdown == true){
      this.dropdown = false;
    }else{
      this.dropdown = true;
    }
  }

  public onChangeImg (image : any) {
    this.selectedImg = image;
  }

  public async onChange(event: any, index: number, type: string) {
    const selectedValue = event.target.value;
    if (type ==  'localizacao') {
      await this.getSubLocais(index, selectedValue)
      await this.getPosicoes(index, this.sublocais[index]?.sublocais[0]["idsublocalizacao"])
    }
    if(type ==  'sublocalizacao') {
      await this.getPosicoes(index, selectedValue)
    }
    if (type == 'delete'){
      this.deleteData = [];
      this.hideLocais = [];
      this.hideLocais = Array(50).fill(-1);
      this.addData = [0 , 0]
      let length = this.localizacoesArtigo.length - 1;
      for (let i = length; i >= 0; i--) {
        if (this.localizacoesArtigo[i]['idlocalizacao'] === 0 && this.localizacoesArtigo[i]['idsublocalizacao'] === 0){
          this.localizacoesArtigo.splice(i, 1);
        }
      }
    }
  }

  public onDelete(index : number = -1){
    if (this.localizacoesArtigo[index]['idlocalizacao'] === 0 && this.localizacoesArtigo[index]['idsublocalizacao'] === 0){
      this.localizacoesArtigo.splice(index, 1);
    }else{
      this.deleteData.push(this.localizacoesArtigo[index]);
      this.hideLocais[index]=index;
    }
  }

  public async onAddLocais(local: any) {
    if (local) {
      this.localizacoesArtigo.push(local);
      this.localizacoesArtigo[this.localizacoesArtigo.length - 1]['idartigo'] = this.barcode;
      this.localizacoesArtigo[this.localizacoesArtigo.length - 1]['qtlocal'] = 0 ;
    } else {
      let localId = await this.getIdLocal(1, 1, 1);
      const newLocation = {
        idlocalizacaoartigos: localId,
        idartigo: this.barcode,
        idlocalizacao: 1,
        idsublocalizacao: 1,
        idposicao: 1,
        qtlocal: 0,
      };
      this.localizacoesArtigo.push(newLocation);
    }

    if (this.addData[0] === 0) {
      this.addData[0] = this.localizacoesArtigo.length - 1;
      this.addData[1] = this.localizacoesArtigo.length;
    } else {
      this.addData[1] = this.localizacoesArtigo.length;
    }
    await this.getSubLocais(this.localizacoesArtigo.length - 1, this.localizacoesArtigo[this.localizacoesArtigo.length - 1]['idlocalizacao']);
    await this.getPosicoes(this.localizacoesArtigo.length - 1, this.localizacoesArtigo[this.localizacoesArtigo.length - 1]['idsublocalizacao']);
  }

  public async editarLocais(event: any) {
    const updatedData = event.target.elements;

    let add: any = [];
    let lengthUpdate = updatedData.localizacao.length - 1;
    let idlocal: any;
    this.confirmar = 'nulo';
    
    if (this.addData[0] !== 0) {
        for (let i = this.addData[1] - 1; i >= this.addData[0]; i--) {
            idlocal = await this.getIdLocal(
                parseInt(updatedData.localizacao[lengthUpdate].value), 
                parseInt(updatedData.sublocalizacao[lengthUpdate].value), 
                parseInt(updatedData.posicao[lengthUpdate].value)
            );

            this.localizacoesArtigo[i]['idlocalizacao'] = parseInt(updatedData.localizacao[lengthUpdate].value);
            this.localizacoesArtigo[i]['idsublocalizacao'] = parseInt(updatedData.sublocalizacao[lengthUpdate].value);
            this.localizacoesArtigo[i]['idposicao'] = parseInt(updatedData.posicao[lengthUpdate].value);
            this.localizacoesArtigo[i]['qtlocal'] = parseInt(updatedData.qtLocal[lengthUpdate].value);
            this.localizacoesArtigo[i]['idlocalizacaoartigos'] = idlocal;
            lengthUpdate = lengthUpdate - 1;
            add.push(this.localizacoesArtigo[i]);
        }
        this.localizacoesArtigo.splice(this.addData[0], this.addData[1] - this.addData[0]);
        this.insertLocalArtigo(add);
    }
    if (this.deleteData.length > 0) {
        for (let i = 0; i < this.deleteData.length; i++) {
            const idToDelete = this.deleteData[i]['idlocalizacaoartigos'];
            const indexToDelete = this.localizacoesArtigo.findIndex((item: { idlocalizacaoartigos: any; }) => item.idlocalizacaoartigos === idToDelete);
            if (indexToDelete !== -1) {
                this.localizacoesArtigo.splice(indexToDelete, 1);
            }
        }
        this.deleteLocalArtigo(this.deleteData);
    }

    for (let i = 0; i < this.localizacoesArtigo.length; i++) {
        this.localizacoesArtigo[i]['idlocalizacao'] = parseInt(updatedData.localizacao[i].value);
        this.localizacoesArtigo[i]['idsublocalizacao'] = parseInt(updatedData.sublocalizacao[i].value);
        this.localizacoesArtigo[i]['idposicao'] = parseInt(updatedData.posicao[i].value);

        if(updatedData.qtLocal[i].value){
            this.localizacoesArtigo[i]['qtlocal'] = parseInt(updatedData.qtLocal[i].value);
        } else {
            this.dataEmZero.push(this.localizacoesArtigo[i]);
        } 
    }
    this.validaçãoQT();

    if (this.dataEmZero[0]) {
        const interval = setInterval(() => {
            this.showConfirmar = true;
            if (this.confirmar !== 'nulo') {
                clearInterval(interval);
                if (this.confirmar === 'true') {
                    this.updateArtigoLocal();
                    this.segmentValue = "consulta";
                    this.deleteData = [];
                    this.hideLocais = Array(50).fill(-1);
                    this.addData = [0, 0];
                    this.getLocalProducto(this.barcode);
                    this.dataEmZero = [];
                    this.showConfirmar = false; 
                }
                if (this.confirmar === 'false') {
                    this.deleteData = [];
                    this.hideLocais = Array(50).fill(-1);
                    this.addData = [0, 0];
                    this.getLocalProducto(this.barcode);
                    this.dataEmZero = [];
                    this.showConfirmar = false; 
                }
            }
        }, 100);
    } else {
        this.updateArtigoLocal();
        this.segmentValue = "consulta";
        this.deleteData = [];
        this.hideLocais = Array(50).fill(-1);
        this.addData = [0, 0];
        this.dataEmZero = [];
        this.getLocalProducto(this.barcode);
    }
  }

  public validaçãoQT(){
    let stock : number = 0;
    for (let i = 0; i < this.localizacoesArtigo.length; i++){
      stock = stock + parseInt(this.localizacoesArtigo[i]['qtlocal'])
    }
    if (this.artigos[0]['stockloja'] !== stock){
      this.isQtStock = true;
    }
  }

  public updateArtigoLocal() {
    this.server.updateLocalArtigo(this.barcode, this.localizacoesArtigo).catch(error => {
        alert('Error updating local:' + JSON.stringify(error));
    });
    this.getLocalProducto(this.barcode);
  }

  public insertLocalArtigo(localizacoesNovas : []) {
    this.server.insertLocalizacao(localizacoesNovas).catch(error => {
      alert('Error inserting local:' + JSON.stringify(error));
    });
    this.getLocalProducto(this.barcode);
  }

  public deleteLocalArtigo(localizacao : number) {
    for(let i = 0; i < this.deleteData.length; i++){
      this.server.deleteLocalArtigo(this.barcode , this.deleteData[i]['idlocalizacaoartigos']).catch(error => {
        alert('Error inserting local:' + JSON.stringify(error));
      });
    }
    this.getLocalProducto(this.barcode);
  }

  public async startScan(): Promise<void> {
      const formats = [this.barcodeFormat.Aztec, this.barcodeFormat.Codabar, this.barcodeFormat.Code39, this.barcodeFormat.Code93, this.barcodeFormat.Code128, this.barcodeFormat.DataMatrix, this.barcodeFormat.Ean8, this.barcodeFormat.Ean13, this.barcodeFormat.Itf, this.barcodeFormat.Pdf417, this.barcodeFormat.UpcA, this.barcodeFormat.UpcE,];
  
      const element = await this.dialogService.showModal({
        component: ArtigoModalComponent,
        cssClass: 'barcode-scanning-modal',
        showBackdrop: false,
        componentProps: {
          formats: formats,
        },
      });
  
      element.onDidDismiss().then((result) => {
        const barcode: Barcode | undefined = result.data?.barcode;
        if (barcode) {
          this.getLocalizacao(barcode.displayValue);
        }
      });
  }
}
