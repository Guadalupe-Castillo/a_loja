import { Injectable } from '@angular/core'
import { LoadingController, ToastController } from '@ionic/angular'
import { AuthChangeEvent, createClient, Session, SupabaseClient } from '@supabase/supabase-js'
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class SupabaseService{
    public supabase: SupabaseClient

    constructor(
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController
    ) {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
    }

    //INSTERT

    async insertLocalizacao(items: any[]) {
        try {   
            const promises = items.map(async (item) => {
                const { data, error } = await this.supabase
                .from('localizacaoartigos_t')
                .insert({
                idlocalizacaoartigos: item.idlocalizacaoartigos,
                idartigo: item.idartigo,
                idlocalizacao: item.idlocalizacao,
                idsublocalizacao: item.idsublocalizacao,
                idposicao: item.idposicao,
                qtlocal: item.qtlocal
                });
                if (error) {
                    throw error;
                }
                await this.insertLog([`Inserted localizacao for artigo ${item.idartigo}`, new Date().toISOString()]);
                return data;
            });

            const results = await Promise.all(promises);
            return { success: true, message: "All inserts completed.", results };
        } catch (error) {
            console.error('Unexpected error:', error);
            throw new Error('An error occurred while inserting data');
        }
    }
    
    async insertLog(log: any[]) {
        try {
            const lastID = await this.getLastIdLog(); 
            const iduser = await this.getUser();
            const hora_modificacao = new Date().toISOString();
    
            const { data, error } = await this.supabase
                .from('logs')
                .insert({
                    id_log: lastID ? lastID + 1 : 1, 
                    modificacao: log[0], 
                    date_modificacao: hora_modificacao, 
                    id_user: iduser,
                });
        } catch (error) {
            console.error('Unexpected error in insertLog:', error);
            throw new Error('An error occurred while inserting log');
        }
    }
    
    //GET
    getUser() {
        return this.supabase.auth.getUser().then(({ data }) => {
            return data?.user?.id; // Return the user ID directly as a string
        }).catch((error) => {
            console.error('Error accessing user:', error);
            return null; // Return null in case of error
        });
    }
    
    async getLogs() {
        try {
            const { data, error } = await this.supabase
            .from('logs')
            .select(`*, profiles(username)`)
            .order('id_log', { ascending: false });

            return data;
        } catch (error) {
            console.log('Error fetching artigo:', JSON.stringify (error));
            throw new Error('An error occurred while fetching data');
        }
    }

    async getArtigo(barcode: string) {
        try {
            const { data, error } = await this.supabase
            .from('artigos_t')
            .select(`
            *,
            marcas_t(marca),
            fornecedores_t(nome),
            categoriasartigos_t(categoriaprincipal),
            familiasartigos_t(familia),
            subfamilias_t(subfamilia),
            artigowww_t(descricaoartigo, link)
            `)
            .eq('idartigo', barcode);

            if (error) {
                console.log('Error fetching artigo:', JSON.stringify (error));
                throw new Error('Error fetching artigo');
            }

            return data;
        } catch (error) {
            console.log('Error fetching artigo:', JSON.stringify (error));
            throw new Error('An error occurred while fetching data');
        }
    }
    
    async getArtigoByEAN(barcode: string) {
        try {
            const { data, error } = await this.supabase
            .from('artigos_t')
            .select(`
            *,
            marcas_t(marca),
            fornecedores_t(nome),
            categoriasartigos_t(categoriaprincipal),
            familiasartigos_t(familia),
            subfamilias_t(subfamilia),
            artigowww_t(descricaoartigo)
            `)
            .eq('ean', barcode);

            if (error) {
                console.log('Error fetching artigo:', JSON.stringify (error));
                throw new Error('Error fetching artigo');
            }

            return data;
        } catch (error) {
            console.log('Error fetching artigo:', JSON.stringify (error));
            throw new Error('An error occurred while fetching data');
        }
    }
    
    async getArtigoBySearch(search: string, filters: any = {}) {
        try {
            let query = this.supabase
                .from('artigos_t')
                .select(`
                    *,
                    marcas_t(marca),
                    fornecedores_t(nome),
                    categoriasartigos_t(categoriaprincipal),
                    familiasartigos_t(familia),
                    subfamilias_t(subfamilia)
                `)
                .or(`
                    idartigo.ilike.%${search}%, 
                    artigo.ilike.%${search}%, 
                    codigointerno.ilike.%${search}%
                `.replace(/\s+/g, ''))
                .order('idartigo', { ascending: true });
    
            if (Object.keys(filters).length === 0) {
                query = query.or(`
                    marcas_t.marca.ilike.%${search}%, 
                    fornecedores_t.nome.ilike.%${search}%, 
                    categoriasartigos_t.categoriaprincipal.ilike.%${search}%, 
                    familiasartigos_t.familia.ilike.%${search}%, 
                    subfamilias_t.subfamilia.ilike.%${search}%
                `.replace(/\s+/g, ''));
            }     
            const { data, error } = await query;
            if (error) {
                console.error('Error fetching artigos:', error);
                throw new Error('Error fetching artigos');
            }
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while fetching data');
        }
    }
       
    async getArtigoWithFilters(search: string | null, filters: any = {}){
        try {
            let query = this.supabase
            .from('artigos_t')
            .select(`
                *,
                marcas_t(marca),
                fornecedores_t(nome),
                categoriasartigos_t(categoriaprincipal),
                familiasartigos_t(familia),
                subfamilias_t(subfamilia)
            `)
            .or(`
                idartigo.ilike.%${search}%, 
                artigo.ilike.%${search}%, 
                codigointerno.ilike.%${search}%
            `.replace(/\s+/g, ''))
            .order('idartigo', { ascending: true });

            if (filters.marca) {
                query = query.eq('idmarca', filters.marca);
            }
            if (filters.fornecedor) {
                query = query.eq('idfornecedor', filters.fornecedor);
            }
            if (filters.categoria) {
                query = query.eq('idcategoriap', filters.categoria);
            }
            if (filters.familia) {
                query = query.eq('idfamilia', filters.familia);
            }
            if (filters.subfamilia) {
                query = query.eq('idsubfamilia', filters.subfamilia);
            }
            const { data, error } = await query;
            if (error) {
                console.error('Error fetching artigos:', error);
                throw new Error('Error fetching artigos');
            }
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while fetching data');
        }
    }
    
    async getMarca() {
        try {
            const { data, error } = await this.supabase
            .from('marcas_t')
            .select('*');
            if (error) {
                console.error('Error fetching marcas:', error);
                throw new Error('Error fetching marcas');
            }
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while fetching data');
        }
    }

    async getCategoria() {
        try {
            const { data, error } = await this.supabase
            .from('categoriasartigos_t')
            .select('*');
            if (error) {
                console.error('Error fetching categorias:', error);
                throw new Error('Error fetching categorias');
            }
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while fetching data');
        }
    }

    async getFornecedores() {
        try {
            const { data, error } = await this.supabase
            .from('fornecedores_t')
            .select('*');
            if (error) {
                console.error('Error fetching fornecedores:', error);
                throw new Error('Error fetching fornecedores');
            }
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while fetching data');
        }
    }

    async getFamilias() {
        try {
            const { data, error } = await this.supabase
            .from('familiasartigos_t')
            .select('*');
            if (error) {
                console.error('Error fetching familias:', error);
                throw new Error('Error fetching familias');
            }
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while fetching data');
        }
    }

    async getSubFamilias() {
        try {
            const { data, error } = await this.supabase
            .from('subfamilias_t')
            .select('*');
            if (error) {
                console.error('Error fetching subfamilias:', error);
                throw new Error('Error fetching subfamilias');
            }
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while fetching data');
        }
    }

    async getLocalizacoesArtigos(barcode : string) {
        try {
            const { data, error } = await this.supabase
            .from('localizacaoartigos_t')
            .select(`
                *,
                localizacao_t(localizacao),
                sublocalizacao_t(sublocalizacao),
                posicao_t(posicao)
                `)
            .eq('idartigo', barcode)
            .order('idlocalizacao', { ascending: true });
            if (error) {
                console.error('Error fetching localizacaoartigos:', error);
                throw new Error('Error fetching localizacaoartigos');
            }
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while fetching data');
        }
    }

    async getLocais() {
        try {
            const { data, error } = await this.supabase
            .from('localizacao_t')
            .select('*');
            if (error) {
                console.error('Error fetching localizacao:', error);
                throw new Error('Error fetching localizacao');
            }
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while fetching data');
        }
    }

    async getSublocais(idLocal : number) {
        try {
            const { data, error } = await this.supabase
            .from('sublocalizacao_t')
            .select('*')
            .eq('idlocalizacao', idLocal);
            if (error) {
                console.error('Error fetching sublocalizacao:', error);
                throw new Error('Error fetching sublocalizacao');
            }
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while fetching data');
        }
    }

    async getPosicoes(idSubLocal : number) {
        try {
            const { data, error } = await this.supabase
            .from('posicao_t')
            .select('*')
            .eq('idsublocalizacao', idSubLocal);
            if (error) {
                console.error('Error fetching posicao:', error);
                throw new Error('Error fetching posicao');
            }
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while fetching data');
        }
    }

    async getIdLocal(idL : number, idS : number, idP : number) {
        try {
          const { data, error } = await this.supabase
            .from('localizacaoartigos_t')
            .select('idlocalizacaoartigos')
            .eq('idlocalizacao',idL)
            .eq('idsublocalizacao',idS)
            .eq('idposicao',idP)
            .limit(1); 
    
          if (error) {
            console.error('Error fetching last ID:', error);
            throw new Error('Error fetching last ID');
          }
    
          return data.length > 0 ? data[0].idlocalizacaoartigos : null;
        } catch (error) {
          console.error('Error:', error);
          throw new Error('An error occurred while fetching data');
        }
    }

    async getLastIdLog() {
        try {
          const { data, error } = await this.supabase
            .from('logs')
            .select('id_log')
            .order('id_log', { ascending: false })
            .limit(1); 
          if (error) {
            console.error('Error fetching last ID:', error);
            throw new Error('Error fetching last ID');
          }
          return data.length > 0 ? data[0].id_log : null;
        } catch (error) {
          console.error('Error:', error);
          throw new Error('An error occurred while fetching data');
        }
    }

    async getArtigoLocalizacao(id : string) {
        try {
            const { data, error } = await this.supabase
            .from('artigos_t')
            .select(`
                *, 
                localizacaoartigos_t!inner(idlocalizacaoartigos, etiqueta)
            `)
            .eq('localizacaoartigos_t.idlocalizacaoartigos', id)
            .order('idartigo', { ascending: true });
            if (error) {
                console.error('Error fetching localizacao:', error);
                throw new Error('Error fetching localizacao');
            }
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while fetching data');
        }
    }

    async getLocalizacao( id: string){
        try {
            const { data, error } = await this.supabase
            .from('localizacaoartigos_t')
            .select(`*, 
                    localizacao_t(localizacao),
                    sublocalizacao_t(sublocalizacao),
                    posicao_t(posicao)
                `)
            .eq('idlocalizacaoartigos', id)
            .limit(1);
            if (error) {
                console.error('Error fetching localizacao:', error);
                throw new Error('Error fetching localizacao');
            }
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('An error occurred while fetching data');
        } 
    }

    //UPDATE
    async updateLocalArtigo(idArtigo: string | null, locais: any[]) {
        console.log(locais);

        try {
            const promises = locais.map(async (local, index) => {
                console.log('IDlocal: ', local.idlocalizacao, local.idsublocalizacao, local.idposicao )
                
                let newIdLocalizacao = await this.getIdLocal(local.idlocalizacao, local.idsublocalizacao, local.idposicao);

                console.log('IDlocal: ' + newIdLocalizacao)
                
                const { data, error } = await this.supabase
                    .from('localizacaoartigos_t')
                    .update({
                        idlocalizacaoartigos: newIdLocalizacao,
                        idlocalizacao: local.idlocalizacao,
                        idsublocalizacao: local.idsublocalizacao,
                        idposicao: local.idposicao,
                        qtlocal: local.qtlocal
                    })
                    .eq('idartigo', idArtigo)
                    .eq('idlocalizacaoartigos', local.idlocalizacaoartigos);
    
                if (error) {
                    throw error;
                }
                return data;
            });
            await this.insertLog([`Updated localizacao for artigo ${idArtigo}`, new Date().toISOString()]);
            const results = await Promise.all(promises);
            return { success: true, message: "All updates completed.", results };
        } catch (error) {
            console.error('Unexpected error:', error);
            throw new Error('An error occurred while updating data');
        }
    }

    async updateEtiqueta(idArtigo : string, idLocalizacao: string, qt : number){
        try { 
            const { data, error } = await this.supabase
            .from('localizacaoartigos_t')
            .update({
                etiqueta: qt
            })
            .eq('idartigo', idArtigo)
            .eq('idlocalizacaoartigos', idLocalizacao);
            if (error) {
                throw error;
            }
            console.log('idArtigo: ' + idArtigo + ' idlocalizacaoartigos: ' + idLocalizacao + ' QT: ' + qt );
            await this.insertLog([`Updated etiquetas for artigo ${idArtigo}`, new Date().toISOString()]);
            return data;
        }catch (error) {
            console.error('Unexpected error:', error);
            throw new Error('An error occurred while updating data');
        }
    }

    //DELETE
    async deleteLocalArtigo (idArtigo : string | null, idLocalizacao : string) {
        try {
            const { data, error } = await this.supabase
            .from('localizacaoartigos_t')
            .delete()
            .eq('idartigo', idArtigo)
            .eq('idlocalizacaoartigos', idLocalizacao);
            await this.insertLog([`Deleted localizacao for artigo ${idArtigo}`, new Date().toISOString()]);
        }catch (error) {
            console.error('Unexpected error:', error);
            throw new Error('An error occurred while deleting data');
        }
    }

    //auth  data and fucntions

    getSession() {
        return this.supabase.auth.getSession().then(({ data }) => data?.session)
    }

    authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
        return this.supabase.auth.onAuthStateChange(callback)
    }

    signIn(email: string, password: string) {
        return this.supabase.auth.signInWithPassword({ email , password })
    }

    signOut() {
        return this.supabase.auth.signOut()
    }

    async createNotice(message: string) {
        const toast = await this.toastCtrl.create({ message, duration: 5000 })
        await toast.present()
    }

    createLoader() {
        return this.loadingCtrl.create()
    }
}