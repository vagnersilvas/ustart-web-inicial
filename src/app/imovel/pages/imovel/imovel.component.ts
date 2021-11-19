import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { debounce } from 'rxjs/operators';
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

  constructor(
    private router: Router,
    private imovelService: ImovelService,
    private modalService: NzModalService
  ) {  }

  ngOnInit(): void {
    this.pesquisar("");
  }

  public novo(): void {
    const url = `${AppRoutes.Imovel.CadImovel()}/novo`;
    this.router.navigateByUrl(url);
  }
  
  public localizar(event: any): void {    
    this.pesquisar(event.target.value);

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
