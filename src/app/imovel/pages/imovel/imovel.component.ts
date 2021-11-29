import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { debounce } from 'lodash';
import { AppRoutes } from 'src/app/app-routes';
import { ImovelService } from 'src/app/data-services/imovel.service';
import { Imovel } from 'src/app/models/imoveis/imoveis';

@Component({
  selector: 'app-imovel',
  templateUrl: './imovel.component.html',
  styleUrls: ['./imovel.component.scss']
})
export class ImovelComponent implements OnInit {

  public loading: boolean = false;
  public imovel: Imovel[] = [];
  
  public fallbackImg ='data:image/jpeg;base64,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'
    


  constructor(
    private router: Router,
    private imovelService: ImovelService,
    private modalService: NzModalService
  ) { 
    this.localizar = debounce(this.localizar, 400);

   }

  ngOnInit(): void {
    this.pesquisar("");
  }

  public novo(): void {
    const url = `${AppRoutes.Imovel.CadImovel()}/novo`;
    this.router.navigateByUrl(url);
  }
  
  public localizar(event: any): void {
    const value = event.target.value;
    if (value && value.trim() !== '') {
      console.log("Localizar", value)
      this.pesquisar(value);
    } else {
      this.limparPesquisa();
    }
  }

  private pesquisar(pesquisa: string): void {
    this.loading = true;
    this.imovelService.get(pesquisa).subscribe(
      (result) => {
        this.imovel = result;
        this.loading = false;
      },
      (err) => {
        this.loading = false;
      }
    );
  }

  public limparPesquisa(): void {
    console.log("limpar");
    this.pesquisar("");
  }
  
  
  public editar(imovel: Imovel): void {
    var url = `${AppRoutes.Imovel.CadImovel()}/${imovel.id}`;
    this.router.navigateByUrl(url);
  }
  
  
  public excluir(imovel: Imovel): void {
    if (confirm(`Deseja excluir o registro ${imovel.descricao}?`)) {
      this.imovelService.delete(imovel.id).subscribe(
        (result) => {
          this.pesquisar("");
        },
        (err) => {
          let msg: string = '';
          if (err.error) {
            for (const iterator of err.error) {
              msg += `<p>${iterator.message}</p>`
            }

          }
          this.modalService.error({
            nzTitle: 'Falha ao excluir o registro',
            nzContent: `<p>Verifique os dados e tente novamente.</p>
                        ${msg}`
          });

        }
      );
    }
  }
}
