import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppRoutes } from 'src/app/app-routes';
import { ClienteService } from 'src/app/data-services/clientes.service';
import { IbgeService } from 'src/app/data-services/ibge.service';
import { ImovelService } from 'src/app/data-services/imovel.service';
import { UsuariosService } from 'src/app/data-services/usuarios.service';
import { AssignFormHelper } from 'src/app/helper/AssignFormHelper';
import { Cliente } from 'src/app/models/clientes/cliente';
import { Cidade } from 'src/app/models/ibge/cidade';
import { Estado } from 'src/app/models/ibge/estado';
import { Imovel } from 'src/app/models/imoveis/imoveis';
import { Usuario } from 'src/app/models/users/usuario';

@Component({
  selector: 'app-cad-imovel',
  templateUrl: './cad-imovel.component.html',
  styleUrls: ['./cad-imovel.component.scss']
})
export class CadImovelComponent implements OnInit {

  private idSelecionado: string;
  public clienteSelecionado: string;
  public carregandoClientes: boolean = false;
  public cliente: Cliente[]=[];

  public usuarioSelecionado: string;
  public carregandoUsuario: boolean = false;
  public usuario: Usuario[]=[];

  public novoRegistro: boolean = false;
  public imovel: Imovel;
  public ImovelFinalidade: boolean = true;

  public estados: Estado[] = [];
  public carregandoEstados: boolean = false;
  public estadoSelecionado: Number = 0;

  public cidades: Cidade[] = [];
  public carregandoCidades: boolean = false;
  public cidadeSelecionada: Number = 0;

  public form: FormGroup = new FormGroup({
    usuarioId: new FormControl(null, [Validators.required]),
    clienteId: new FormControl(null, [Validators.required]),
    tipoImovel: new FormControl(null, []),
    descricao: new FormControl(null, []),
    finalidade: new FormControl(null, []),
    suite: new FormControl(null, []),
    dormitorios: new FormControl(null, []),
    vagasGaragem: new FormControl(0, []),
    areaConstruida: new FormControl(1, [Validators.min(1)]),
    areaTotal: new FormControl(1, [Validators.min(1)]),
    urlImagem: new FormControl(null, []),
    rua: new FormControl(null, []),
    numero: new FormControl(null, []),
    bairro: new FormControl(null, []),
    complemento: new FormControl(null, []),
    cep: new FormControl(null, []),
    estadoId: new FormControl(null, []),
    cidadeId: new FormControl(null, []),
    valorAluguel: new FormControl(1, [Validators.min(1)]),
    valorVenda: new FormControl(1, [Validators.min(1)]),
    situacao: new FormControl(null, []),

  })

  constructor(
    private router: Router,
    private imovelService: ImovelService,
    private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private modalService: NzModalService,
    private ibgeService: IbgeService,
    private usuarioService: UsuariosService

  ) {
    this.activatedRoute.params.subscribe(
      (params) => {

        this.idSelecionado = params.id;

        if (this.idSelecionado == null || this.idSelecionado.toLowerCase() === 'novo') {
          this.novoRegistro = true;
          this.imovel = new Imovel();
          //Caso contrário devemos consultar na base para atualizar os valores
        } else {
          this.pesquisarPorId();
        }
      });
  }

  ngOnInit(): void {
    this.carregarClientes();
    this.ImovelFinalidadeChange();
    this.carregarEstados();
    this.carregarUsuarios();
  }

  public ImovelFinalidadeChange() {
    if (this.ImovelFinalidade) {
      this.form.get("valorAluguel").setValidators(Validators.required)
    } else {
      this.form.get("valorAluguel").clearValidators()
    }

    if (this.ImovelFinalidade == false) {
      this.form.get("valorVenda").setValidators(Validators.required)
    } else {
      this.form.get("valorVenda").clearValidators()
    }
  }
 
  private carregarClientes() {
    this.clienteService.get("").subscribe(
      (result) => {
        this.carregandoClientes = false;
        this.cliente = result;
      },
      (error) => {
        this.carregandoClientes = false;
        this.modalService.error({
          nzTitle: 'Falha ao carregar os clientes',
          nzContent: 'Não foi possível carregar a lista de clientes.'
        });
        console.log(error);
      });
  }
  private carregarUsuarios() {
    this.usuarioService.getUsers("").subscribe(
      (result) => {
        this.carregandoUsuario = false;
        this.usuario = result;
      },
      (error) => {
        this.carregandoUsuario = false;
        this.modalService.error({
          nzTitle: 'Falha ao carregar os usuario',
          nzContent: 'Não foi possível carregar a lista de clientes.'
        });
        console.log(error);
      });
  }

  private pesquisarPorId() {
    this.imovelService.getById(this.idSelecionado).subscribe(
      (result) => {
        this.imovel = result;
        this.carregarDados();
      },
      (err) => { }
    );
  }

  public cancelar(): void {
    this.router.navigateByUrl(AppRoutes.Imovel.base());
  }

  public salvar(): void {

    //Passa os valores do form para o objeto
    AssignFormHelper.assignFormValues<Imovel>(this.form, this.imovel);

    //Se o form estiver válido segue para o processo de salvar ou atualizar
    if (this.form.valid) {
      //Verificar qual operaçao o usuário está querendo executar
      const operacao = this.novoRegistro
        ? this.imovelService.add(this.imovel)
        : this.imovelService.update(this.imovel);

      operacao.subscribe((result) => {
        this.cancelar();
      },
        (err) => {
          let msg: string = '';
          if (err.error) {
            for (const iterator of err.error) {
              msg += `<p>${iterator.message}</p>`
            }

          }
          this.modalService.error({
            nzTitle: 'Falha ao registrar o registro',
            nzContent: `<p>Verifique os dados e tente novamente.</p>
                      ${msg}`
          });

        })
    }
  }

  private carregarDados() {
    if (this.imovel) {
      this.form.get("usuarioId").setValue(this.imovel.usuarioId);
      this.form.get("tipoImovel").setValue(this.imovel.tipoImovel);
      this.form.get("descricao").setValue(this.imovel.descricao);
      this.form.get("finalidade").setValue(this.imovel.finalidade);
      this.form.get("suite").setValue(this.imovel.suite);
      this.form.get("dormitorios").setValue(this.imovel.dormitorios);
      this.form.get("vagasGaragem").setValue(this.imovel.vagasGaragem);
      this.form.get("areaConstruida").setValue(this.imovel.areaConstruida);
      this.form.get("areaTotal").setValue(this.imovel.areaTotal);
      this.form.get("urlImagem").setValue(this.imovel.urlImagem);
      this.form.get("rua").setValue(this.imovel.rua);
      this.form.get("numero").setValue(this.imovel.numero);
      this.form.get("bairro").setValue(this.imovel.bairro);
      this.form.get("cep").setValue(this.imovel.cep);
      this.form.get("complemento").setValue(this.imovel.complemento);
      this.form.get("valorAluguel").setValue(this.imovel.valorAluguel);
      this.form.get("valorVenda").setValue(this.imovel.valorVenda);
      // this.form.get("situacao").setValue(this.imovel.situacao);




      // Campos 
      this.estadoSelecionado = Number(this.imovel.estadoId);
      this.cidadeSelecionada = Number(this.imovel.cidadeId);
      
      this.usuarioSelecionado= this.imovel.usuarioId;
     
      this.clienteSelecionado = this.imovel.clienteId;
    }
  }

  private carregarEstados() {
    this.ibgeService.getEstados().subscribe(
      (estados) => {
        this.carregandoEstados = false;
        this.estados = estados;
      },
      (error) => {
        this.carregandoEstados = false;
        this.modalService.error({
          nzTitle: 'Falha ao carregar os estados',
          nzContent: 'Não foi possível carregar a lista de estados.'
        });
        console.log(error);
      });
  }

  public carregarCidades(estadoId: number): void {
    this.carregandoCidades = true;
    this.ibgeService.getCidades(estadoId).subscribe(
      (cidades) => {
        this.carregandoCidades = false;
        this.cidades = cidades;
      },
      (error) => {
        this.carregandoCidades = false;
        this.modalService.error({
          nzTitle: 'Falha ao carregar as cidades',
          nzContent: 'Não foi possível carregar a lista de cidades.'
        });
        console.log(error);
      })
  }

}
