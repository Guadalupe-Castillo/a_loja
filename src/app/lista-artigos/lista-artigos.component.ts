import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from 'src/services/supabase.service';

@Component({
  selector: 'app-lista-artigos',
  templateUrl: './lista-artigos.component.html',
  styleUrls: ['./lista-artigos.component.scss'],
})
export class ListaArtigosComponent implements OnInit {
  @Input() search: string | null = null;
  artigos: any[] = [];
  errorMsg: string | null = null;
  filtros: any = {
    marcas: [],
    fornecedores: [],
    categorias: [],
    familias: [],
    subfamilias: []
  };
  filters = {
    marca: '',
    fornecedor: '',
    categoria: '',
    familia: '',
    subfamilia: ''
  };

  constructor(public route: ActivatedRoute, public server: SupabaseService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.search = params.get('search');
      if (this.search) {
        this.getArtigos(this.search);
      }
    });
    this.loadFilters()
  }

  loadFilters() {
    this.server.getMarca().then(marcas => {this.filtros.marcas = marcas});
    this.server.getFornecedores().then(fornecedores => {this.filtros.fornecedores = fornecedores});
    this.server.getCategoria().then(categorias => {this.filtros.categorias = categorias});
    this.server.getFamilias().then(familias => {this.filtros.familias = familias});
    this.server.getSubFamilias().then(subfamilias => {this.filtros.subfamilias = subfamilias});
  }

  public getArtigos(search: string) {
    this.artigos = [];

    if (!this.filters){
      this.server.getArtigoBySearch(search, this.filters).then((response: any) => {
        this.artigos = response;
        this.errorMsg = null; 
        if (!response[0]) {
          this.errorMsg = 'No search results found'
        }
      })
      .catch(error => {
        alert('Error fetching product:' + JSON.stringify(error));
        this.errorMsg = 'Could not fetch product details. Please try again later.';
      });
    }else {
      this.getArtigoWithFilters()
    }
  }

  public getArtigoWithFilters(){
    this.artigos = [];
    this.server.getArtigoWithFilters(this.search ,this.filters).then((response: any) => {
      this.artigos = response;
    }).catch((err) => {
      alert('Error fetching products with filters: ' + JSON.stringify(err));
    });
  }
}
